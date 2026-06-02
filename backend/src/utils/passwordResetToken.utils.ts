import { createHash, randomBytes } from 'crypto';

/**
 * Generates the raw reset token that is sent only through email.
 *
 * @return Hex-encoded cryptographically secure token
 */
export const createRawPasswordResetToken = (): string => {
  return randomBytes(32).toString('hex');
};

/**
 * Hashes a raw reset token before storing or querying it.
 *
 * @param token - Raw token from the email link
 * @return SHA-256 token hash
 */
export const hashPasswordResetToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};
