import { Types } from 'mongoose';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import type { EmailService } from '@domain/ports/emailService.port';
import {
  createRawPasswordResetToken,
  hashPasswordResetToken,
} from '@utils/passwordResetToken.utils';

const PASSWORD_RESET_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export type RequestPasswordResetResult =
  | { status: 'EMAIL_SENT'; expiresAt: Date }
  | { status: 'EMAIL_NOT_SENT' }
  | { status: 'RESET_LINK_ALREADY_ACTIVE'; expiresAt: Date };

const buildResetUrl = (token: string): string => {
  const frontendUrl =
    process.env.FRONT_END_URL ??
    process.env.FRONTEND_URL ??
    'http://localhost:5173';

  return `${frontendUrl.replace(/\/$/, '')}/recuperar-contrasena?token=${encodeURIComponent(token)}`;
};

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

  await emailService.sendPasswordResetEmail({
    to: normalizedEmail,
    username: user.username,
    resetUrl: buildResetUrl(rawToken),
    expiresInHours: 24,
  });

  return { status: 'EMAIL_SENT', expiresAt };
};
