import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import { hashPasswordResetToken } from '@utils/passwordResetToken.utils';

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
