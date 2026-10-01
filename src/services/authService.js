import { supabase } from "../lib/supabaseClient";

/**
 * Retrieves the current user's credit balance from the Supabase 'profiles' table
 */
export const getUserBalance = async () => {
  // 1. Get current logged in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return 0;

  // 2. Fetch credit balance directly from the profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('credit_balance')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching balance from Supabase:', error);
    return 0;
  }

  return data?.credit_balance ?? 0;
};

export function generateVirtualRFID() {
  const bytes = [];
  for (let i = 0; i < 4; i++) {
    const hex = Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
    bytes.push(hex);
  }
  return bytes.join(':');
}

/**
 * Validates and normalizes UAE mobile numbers to standard E.164 format (+971XXXXXXXXX)
 */
export function normalizeUAEPhone(phoneInput) {
  if (!phoneInput) return null;
  const cleaned = phoneInput.replace(/[^\d+]/g, '');

  let nationalNumber = '';
  if (cleaned.startsWith('+971')) {
    nationalNumber = cleaned.slice(4);
  } else if (cleaned.startsWith('00971')) {
    nationalNumber = cleaned.slice(5);
  } else if (cleaned.startsWith('971')) {
    nationalNumber = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    nationalNumber = cleaned.slice(1);
  } else {
    nationalNumber = cleaned;
  }

  // Check for valid UAE mobile prefixes (50, 52, 54, 55, 56, 58) followed by 7 digits
  const uaeMobileRegex = /^(50|52|54|55|56|58)\d{7}$/;
  if (!uaeMobileRegex.test(nationalNumber)) {
    return null;
  }

  return `+971${nationalNumber}`;
}

/**
 * Registers a new user with Supabase Auth including normalized phone, virtual RFID, and initial credit balance
 */
export async function signUpUser({ fullName, email, phoneNumber, password, initialCredit = 1000.00 }) {
  const normalizedPhone = normalizeUAEPhone(phoneNumber);
  if (!normalizedPhone) {
    throw new Error('Please enter a valid UAE mobile number (e.g. 0501234567 or +971501234567).');
  }

  const virtualRfid = generateVirtualRFID();

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: password,
    options: {
      data: {
        full_name: fullName.trim(),
        phone_number: normalizedPhone,
        rfid_uid: virtualRfid,
        vehicle: 'Electric Vehicle',
        credit_balance: initialCredit, // Set default initial credit to 1000
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Signs in an existing user using email and password
 */
export async function signInUser({ email, password }) {
  const trimmedEmail = email?.trim().toLowerCase();
  
  if (!trimmedEmail) {
    throw new Error('Please enter your email address.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password: password,
  });

  if (error) throw error;
  return data;
}

/**
 * Signs out the currently authenticated user
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Re-authenticates the current user with their password before permanently deleting the account
 */
export async function reauthenticateAndDelete(password) {
  // 1. Get current logged-in user's email
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) {
    throw new Error("No active session found.");
  }

  // 2. Re-authenticate: verify password against Supabase
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: password,
  });

  if (signInError) {
    throw new Error("Incorrect password. Please try again.");
  }

  // 3. Password verified! Call the backend RPC function
  const { error: rpcError } = await supabase.rpc("delete_user_account");
  if (rpcError) throw rpcError;

  // 4. Wipe local session clean
  await supabase.auth.signOut();
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
}

// ============================================================================
// CREDIT MANAGEMENT SERVICES
// ============================================================================

/**
 * Updates the credit balance in Supabase profiles table and user_metadata
 */
export const updateUserBalance = async (newBalance) => {
  const numericBalance = parseFloat(newBalance);
  if (isNaN(numericBalance)) throw new Error("Invalid balance value provided.");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No active user session.");

  // Step 1: Update in the profiles database table
  const { error: dbError } = await supabase
    .from('profiles')
    .update({ credit_balance: numericBalance })
    .eq('id', user.id);

  if (dbError) throw dbError;

  // Step 2: Update user metadata in Supabase Auth
  const { data, error } = await supabase.auth.updateUser({
    data: {
      credit_balance: numericBalance,
    },
  });

  if (error) throw error;

  // Step 3: Synchronize updated balance with local/session storage cache
  const rawUserData = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (rawUserData) {
    try {
      const parsed = JSON.parse(rawUserData);
      if (!parsed.user_metadata) parsed.user_metadata = {};
      parsed.user_metadata.credit_balance = numericBalance;
      parsed.credit_balance = numericBalance;

      if (localStorage.getItem("currentUser")) {
        localStorage.setItem("currentUser", JSON.stringify(parsed));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(parsed));
      }
    } catch {
      // Retain existing state if JSON parse fails
    }
  }

  return data.user;
};

// ============================================================================
// PASSWORD UPDATE SERVICE
// ============================================================================
export const changeUserPassword = async (currentPassword, newPassword) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user?.email) {
    throw new Error("No active session found. Please log in again.");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: session.user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Current password is incorrect.");
  }

  const now = new Date().toISOString();

  const { data: updateData, error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
    data: {
      password_updated_at: now,
    },
  });

  if (updateError) {
    throw updateError;
  }

  const rawUserData = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (rawUserData) {
    try {
      const parsed = JSON.parse(rawUserData);
      parsed.password_updated_at = now;
      if (!parsed.user_metadata) parsed.user_metadata = {};
      parsed.user_metadata.password_updated_at = now;

      if (localStorage.getItem("currentUser")) {
        localStorage.setItem("currentUser", JSON.stringify(parsed));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(parsed));
      }
    } catch {
      // Retain existing storage state if JSON parse fails
    }
  }

  return true;
};

// ============================================================================
// VEHICLE UPDATE SERVICE
// ============================================================================
export const updateUserVehicle = async (vehicleName) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { vehicle: vehicleName },
  });

  if (error) throw error;

  const rawUserData = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (rawUserData) {
    try {
      const parsed = JSON.parse(rawUserData);
      if (!parsed.user_metadata) parsed.user_metadata = {};
      parsed.user_metadata.vehicle = vehicleName;
      parsed.vehicle = vehicleName;

      if (localStorage.getItem("currentUser")) {
        localStorage.setItem("currentUser", JSON.stringify(parsed));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(parsed));
      }
    } catch {
      // Retain existing storage state if JSON parse fails
    }
  }

  return data;
};

// ============================================================================
// PROFILE UPDATE SERVICE
// ============================================================================
export const updateUserProfileData = async (fullName, phoneNumber) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      phone: phoneNumber,
      phone_number: phoneNumber,
    },
  });

  if (error) throw error;

  const rawUserData = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (rawUserData) {
    try {
      const parsed = JSON.parse(rawUserData);
      if (!parsed.user_metadata) parsed.user_metadata = {};
      parsed.user_metadata.full_name = fullName;
      parsed.user_metadata.phone = phoneNumber;
      parsed.user_metadata.phone_number = phoneNumber;
      parsed.name = fullName;
      parsed.phoneNumber = phoneNumber;

      if (localStorage.getItem("currentUser")) {
        localStorage.setItem("currentUser", JSON.stringify(parsed));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(parsed));
      }
    } catch {
      // Retain existing state if JSON parse fails
    }
  }

  return data;
};