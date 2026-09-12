/**
 * Admin Authentication & Security Module
 * 
 * Secure cryptographic verification for administrative operations.
 * The raw administrative password is never stored or exposed in plaintext within 
 * the codebase or rendered anywhere in the client UI.
 * 
 * Verification utilizes one-way SHA-256 cryptographic hashing (Web Crypto API).
 */

// Cryptographic SHA-256 hash of the designated administrator password
const ADMIN_CREDENTIAL_HASH = 'c1a1864a6f2552f4d46c4381b3808a0e7db5ac231e93d622d678619caa8511ea';

/**
 * Computes a standard SHA-256 hex digest for a given text input.
 */
export async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Cryptographically verifies an attempted administrator password.
 * Returns true if the computed SHA-256 hash matches the authorized hash.
 */
export async function verifyAdminPassword(attempt: string): Promise<boolean> {
  if (!attempt || typeof attempt !== 'string') {
    return false;
  }
  try {
    const computed = await computeSha256(attempt.trim());
    return computed === ADMIN_CREDENTIAL_HASH;
  } catch (error) {
    console.error('Cryptographic verification failed:', error);
    return false;
  }
}
