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
 * Signs in an existing user with either email or UAE phone number and password
 */
export async function signInUser({ identifier, password }) {
  const trimmed = identifier.trim();
  let targetEmail = trimmed.toLowerCase();

  // If input is not an email, process as a UAE phone number
  if (!trimmed.includes('@')) {
    const normalizedPhone = normalizeUAEPhone(trimmed);
    if (!normalizedPhone) {
      throw new Error('Please enter a valid email address or UAE mobile number.');
    }

    // Lookup user by phone number from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('phone_number', normalizedPhone)
      .maybeSingle();

    if (profile?.email) {
      targetEmail = profile.email;
    } else {
      // Fallback to local session check if profiles table lookup is unavailable
      const cached = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (
            parsed.user_metadata?.phone_number === normalizedPhone ||
            parsed.phoneNumber === normalizedPhone
          ) {
            targetEmail = parsed.email;
          }
        } catch {
          // Parsing failure fallback
        }
      }

      if (targetEmail === trimmed.toLowerCase()) {
        throw new Error('No account found with this phone number. Please sign in with email.');
      }
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: targetEmail,
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