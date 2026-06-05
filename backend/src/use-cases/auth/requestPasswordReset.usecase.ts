import { Types } from 'mongoose';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import type { EmailService } from '@domain/ports/emailService.port';
import {
  createRawPasswordResetToken,
  hashPasswordResetToken,
} from '@utils/passwordResetToken.utils';

const PASSWORD_RESET_EXPIRATION_MINUTES = 30;
const PASSWORD_RESET_EXPIRATION_MS =
  PASSWORD_RESET_EXPIRATION_MINUTES * 60 * 1000;

export type RequestPasswordResetResult =
  | { status: 'EMAIL_SENT'; expiresAt: Date }
  | { status: 'EMAIL_NOT_SENT' }
  | { status: 'RESET_LINK_ALREADY_ACTIVE'; expiresAt: Date };

const buildResetUrl = (token: string): string => {
  const frontendUrl = process.env.FRONT_END_URL ?? process.env.FRONTEND_URL;

  if (frontendUrl == null || frontendUrl.trim() === '') {
    if (process.env.ENV === 'production') {
      throw new Error('FRONTEND_URL_CONFIG_MISSING');
    }

    return `http://localhost:5173/recuperar-contrasena?token=${encodeURIComponent(token)}`;
  }

  return `${frontendUrl.replace(/\/$/, '')}/recuperar-contrasena?token=${encodeURIComponent(token)}`;
};

/**
 * Starts the password recovery flow for an active user.
 * Does not reveal whether an email exists and enforces one reset link per cooldown window.
 *
 * @param repositories - User and reset token persistence layers
 * @param emailService - Email sender used to deliver the reset link
 * @param email - User email provided from the recovery form
 * @return Request outcome used by the controller response
 */
export const requestPasswordReset = async (
  repositories: {
    userRepository: UserRepository;
    passwordResetTokenRepository: PasswordResetTokenRepository;
  },
  emailService: EmailService,
  email: string,
): Promise<RequestPasswordResetResult> => {
  const normalizedEmail = email.toLowerCase().trim();
  const user =
    await repositories.userRepository.getUserByEmail(normalizedEmail);

  if (user == null || !user.active) {
    return { status: 'EMAIL_NOT_SENT' };
  }

  const now = new Date();
  const createdAfter = new Date(now.getTime() - PASSWORD_RESET_EXPIRATION_MS);
  const recentToken =
    await repositories.passwordResetTokenRepository.findRecentTokenByUser(
      user._id,
      createdAfter,
    );

  if (recentToken != null) {
    return {
      status: 'RESET_LINK_ALREADY_ACTIVE',
      expiresAt: recentToken.expiresAt,
    };
  }

  const rawToken = createRawPasswordResetToken();
  const tokenHash = hashPasswordResetToken(rawToken);
  const expiresAt = new Date(now.getTime() + PASSWORD_RESET_EXPIRATION_MS);

  // Guard against concurrent requests that could otherwise create two links.
  const wasCreated =
    await repositories.passwordResetTokenRepository.createResetToken(
      {
        _id: new Types.ObjectId(),
        userId: user._id,
        email: normalizedEmail,
        tokenHash,
        expiresAt,
      },
      createdAfter,
    );

  if (!wasCreated) {
    const currentToken =
      await repositories.passwordResetTokenRepository.findRecentTokenByUser(
        user._id,
        createdAfter,
      );

    return {
      status: 'RESET_LINK_ALREADY_ACTIVE',
      expiresAt: currentToken?.expiresAt ?? expiresAt,
    };
  }

  try {
    await emailService.sendPasswordResetEmail({
      to: normalizedEmail,
      username: user.username,
      resetUrl: buildResetUrl(rawToken),
      expiresInMinutes: PASSWORD_RESET_EXPIRATION_MINUTES,
    });
  } catch (error) {
    await repositories.passwordResetTokenRepository.deleteTokenByHash(
      tokenHash,
    );
    throw error;
  }

  return { status: 'EMAIL_SENT', expiresAt };
};
