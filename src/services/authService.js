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