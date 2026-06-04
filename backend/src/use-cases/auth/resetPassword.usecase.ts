import bcrypt from 'bcryptjs';
import { config } from '@config/env.config';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';
import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import { hashPasswordResetToken } from '@utils/passwordResetToken.utils';
import {
  getPasswordPolicyError,
  PASSWORD_POLICY_ERROR_CODE,
} from '@utils/passwordPolicy.utils';

/**
 * Applies a new password using a valid reset token.
 * Revokes existing sessions and consumes the token after the update succeeds.
 *
 * @param repositories - User, refresh token, and reset token persistence layers
 * @param input - Raw reset token and new password
 */
export const resetPassword = async (
  repositories: {
    userRepository: UserRepository;
    refreshTokenRepository: RefreshTokenRepository;
    passwordResetTokenRepository: PasswordResetTokenRepository;
  },
  input: {
    token: string;
    newPassword: string;
  },
): Promise<void> => {
  const passwordPolicyError = getPasswordPolicyError(input.newPassword);

  if (passwordPolicyError != null) {
    const error = new Error(passwordPolicyError);
    error.name = PASSWORD_POLICY_ERROR_CODE;
    throw error;
  }

  const tokenHash = hashPasswordResetToken(input.token.trim());
  const tokenRecord =
    await repositories.passwordResetTokenRepository.findValidToken(
      tokenHash,
      new Date(),
    );

  if (tokenRecord == null) {
    throw new Error('RESET_TOKEN_INVALID');
  }

  const user = await repositories.userRepository.getUserByEmail(
    tokenRecord.email,
  );

  if (user == null || !user.active) {
    throw new Error('USER_NOT_AVAILABLE');
  }

  const passwordHash = await bcrypt.hash(
    input.newPassword,
    config.bcryptSaltRounds,
  );

  await repositories.userRepository.updateUserPassword(
    user.email,
    passwordHash,
  );
  await repositories.refreshTokenRepository.revokeAllUserTokens(user._id);
  await repositories.passwordResetTokenRepository.markTokenAsUsed(tokenHash);
};
