// src/data/users.js

export const allowedUsers = [
  {
    id: "USR-001",
    name: "Blen Tesfaye",
    email: "blen@gmail.com",
    phoneNumber: "+251911234567",
    password: "password123",
    vehicle: "Tesla Model 3",
    role: "user"
  },
  {
    id: "USR-002",
    name: "Alex Johnson",
    email: "alex@gmail.com",
    phoneNumber: "+971501234567",
    password: "securepassword",
    vehicle: "Nissan Leaf",
    role: "user"
  },
  {
    id: "OWR-001",
    name: "Sarah Ahmed",
    email: "sarah@gmail.com",
    phoneNumber: "+971559876543",
    password: "voltopassword",
    charger: "CHG-001",
    role: "owner"
  }
];

/**
 * Validates login credentials against the allowed users list.
 * STRICTLY checks that both the identifier (email/phone) AND the password match.
 */
export const authenticateUser = (identifier, password) => {
  if (!identifier || !password) return null;

  const cleanIdentifier = identifier.trim().toLowerCase();
  const cleanPassword = password.trim(); // Keep exact case for passwords
  
  const user = allowedUsers.find((u) => {
    const isEmailMatch = u.email.toLowerCase() === cleanIdentifier;
    const isPhoneMatch = u.phoneNumber.replace(/\s+/g, "") === cleanIdentifier.replace(/\s+/g, "");
    
    // Both user lookup and password MUST match precisely
    const isPasswordMatch = u.password === cleanPassword;

    return (isEmailMatch || isPhoneMatch) && isPasswordMatch;
  });

  return user || null;
};