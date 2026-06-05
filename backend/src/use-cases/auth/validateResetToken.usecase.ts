import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import { hashPasswordResetToken } from '@utils/passwordResetToken.utils';

/**
 * Checks whether a reset token is unused and not expired.
 *
 * @param passwordResetTokenRepository - Reset token persistence layer
 * @param token - Raw token received from the reset link
 * @return Whether the token can be used to render the reset form
 */
export const validateResetToken = async (
  passwordResetTokenRepository: PasswordResetTokenRepository,
  token: string,
): Promise<boolean> => {
  const cleanToken = token.trim();

  if (cleanToken === '') {
    return false;
  }

  const tokenHash = hashPasswordResetToken(cleanToken);
  const tokenRecord = await passwordResetTokenRepository.findValidToken(
    tokenHash,
    new Date(),
  );

  return tokenRecord != null;
};
