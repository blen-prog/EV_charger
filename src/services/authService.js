import { supabase } from '../lib/supabaseClient';

/**
 * Generates a standard 4-byte hex RFID UID (e.g. A3:5C:89:1F)
 */
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
 * Registers a new user with Supabase Auth including normalized phone and virtual RFID
 */
export async function signUpUser({ fullName, email, phoneNumber, password }) {
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
}

// ============================================================================
// PASSWORD UPDATE SERVICE
// ============================================================================
// Verifies the user's existing credentials before applying a new password.
// Also synchronizes the updated timestamp with client-side cached user state.
export const changeUserPassword = async (currentPassword, newPassword) => {
  // Step 1: Retrieve the active session to verify the user is logged in
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user?.email) {
    throw new Error("No active session found. Please log in again.");
  }

  // Step 2: Security challenge - re-authenticate using current password
  // This prevents unauthorized password changes if a device is left unattended
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: session.user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Current password is incorrect.");
  }

  // Step 3: Dispatch the new password AND save timestamp in Supabase user metadata
  const now = new Date().toISOString();

  const { data: updateData, error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
    data: {
      password_updated_at: now, // Persisted permanently in Supabase database
    },
  });

  if (updateError) {
    throw updateError;
  }

  // Step 4: Persist the update timestamp to local/session storage
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
// Saves the selected vehicle to Supabase user_metadata and synchronizes local storage.
export const updateUserVehicle = async (vehicleName) => {
  // Step 1: Update metadata in Supabase
  const { data, error } = await supabase.auth.updateUser({
    data: { vehicle: vehicleName },
  });

  if (error) throw error;

  // Step 2: Sync updated vehicle into local/session storage cache
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
// Updates user display name and phone number in Supabase user_metadata and local cache.
export const updateUserProfileData = async (fullName, phoneNumber) => {
  // Step 1: Push metadata update to Supabase
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      phone: phoneNumber,
      phone_number: phoneNumber,
    },
  });

  if (error) throw error;

  // Step 2: Sync updated profile with local storage
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