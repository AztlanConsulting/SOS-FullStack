import { Types } from 'mongoose';
import type { EmailService } from '@domain/ports/emailService.port';
import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import type { UserRepository } from '@domain/repositories/user.repository';
import { requestPasswordReset } from '@use-cases/auth/requestPasswordReset.usecase';
import { hashPasswordResetToken } from '@utils/passwordResetToken.utils';

describe('requestPasswordReset use-case (unit)', () => {
  const originalFrontendUrl = process.env.FRONT_END_URL;
  const userId = new Types.ObjectId();
  const activeUser = {
    _id: userId,
    email: 'user@test.com',
    username: 'User',
    active: true,
  };

  const buildRepositories = (
    overrides: Partial<{
      userRepository: Partial<UserRepository>;
      passwordResetTokenRepository: Partial<PasswordResetTokenRepository>;
    }> = {},
  ) => {
    const userRepository: Partial<UserRepository> = {
      getUserByEmail: jest.fn().mockResolvedValue(activeUser),
      ...overrides.userRepository,
    };

    const passwordResetTokenRepository: Partial<PasswordResetTokenRepository> =
      {
        findRecentTokenByUser: jest.fn().mockResolvedValue(null),
        createResetToken: jest.fn().mockResolvedValue(true),
        deleteTokenByHash: jest.fn().mockResolvedValue(undefined),
        ...overrides.passwordResetTokenRepository,
      };

    return {
      userRepository: userRepository as UserRepository,
      passwordResetTokenRepository:
        passwordResetTokenRepository as PasswordResetTokenRepository,
    };
  };

  const buildEmailService = (): EmailService => ({
    sendActivatePlanEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(() => {
    process.env.FRONT_END_URL = 'https://frontend.test';
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.FRONT_END_URL = originalFrontendUrl;
  });

  /**
   * Verifies that unknown emails do not create tokens or send messages.
   */
  test('returns EMAIL_NOT_SENT for unknown users without creating a token', async () => {
    const repositories = buildRepositories({
      userRepository: {
        getUserByEmail: jest.fn().mockResolvedValue(null),
      },
    });
    const emailService = buildEmailService();

    const result = await requestPasswordReset(
      repositories,
      emailService,
      'missing@test.com',
    );

    expect(result).toEqual({ status: 'EMAIL_NOT_SENT' });
    expect(
      repositories.passwordResetTokenRepository.createResetToken,
    ).not.toHaveBeenCalled();
    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies that an active reset link blocks duplicate email delivery.
   */
  test('returns RESET_LINK_ALREADY_ACTIVE when a recent token exists', async () => {
    const expiresAt = new Date('2026-06-05T00:00:00.000Z');
    const repositories = buildRepositories({
      passwordResetTokenRepository: {
        findRecentTokenByUser: jest.fn().mockResolvedValue({ expiresAt }),
      },
    });
    const emailService = buildEmailService();

    const result = await requestPasswordReset(
      repositories,
      emailService,
      ' USER@Test.com ',
    );

    expect(result).toEqual({
      status: 'RESET_LINK_ALREADY_ACTIVE',
      expiresAt,
    });
    expect(repositories.userRepository.getUserByEmail).toHaveBeenCalledWith(
      'user@test.com',
    );
    expect(
      repositories.passwordResetTokenRepository.createResetToken,
    ).not.toHaveBeenCalled();
    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies the happy path: token storage by hash and one outgoing email.
   */
  test('creates a token and sends one reset email for active users', async () => {
    const repositories = buildRepositories();
    const emailService = buildEmailService();

    const result = await requestPasswordReset(
      repositories,
      emailService,
      'user@test.com',
    );

    expect(result.status).toBe('EMAIL_SENT');
    expect(
      repositories.passwordResetTokenRepository.createResetToken,
    ).toHaveBeenCalledTimes(1);
    expect(emailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

    const storedToken = (
      repositories.passwordResetTokenRepository.createResetToken as jest.Mock
    ).mock.calls[0][0];
    const emailPayload = (emailService.sendPasswordResetEmail as jest.Mock).mock
      .calls[0][0];
    const resetUrl = new URL(emailPayload.resetUrl);
    const rawToken = resetUrl.searchParams.get('token');

    expect(emailPayload).toEqual(
      expect.objectContaining({
        to: 'user@test.com',
        username: activeUser.username,
        expiresInHours: 24,
      }),
    );
    expect(rawToken).toBeTruthy();
    expect(storedToken.tokenHash).toBe(hashPasswordResetToken(rawToken ?? ''));
    expect(storedToken.tokenHash).not.toBe(rawToken);
  });

  /**
   * Verifies the race-condition guard when token creation is denied.
   */
  test('does not send email when concurrent token creation is denied', async () => {
    const expiresAt = new Date('2026-06-05T00:00:00.000Z');
    const repositories = buildRepositories({
      passwordResetTokenRepository: {
        findRecentTokenByUser: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ expiresAt }),
        createResetToken: jest.fn().mockResolvedValue(false),
      },
    });
    const emailService = buildEmailService();

    const result = await requestPasswordReset(
      repositories,
      emailService,
      'user@test.com',
    );

    expect(result).toEqual({
      status: 'RESET_LINK_ALREADY_ACTIVE',
      expiresAt,
    });
    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies that failed email delivery rolls back the stored token.
   */
  test('deletes the stored token when email delivery fails', async () => {
    const repositories = buildRepositories();
    const emailService = buildEmailService();
    (emailService.sendPasswordResetEmail as jest.Mock).mockRejectedValue(
      new Error('smtp failed'),
    );

    await expect(
      requestPasswordReset(repositories, emailService, 'user@test.com'),
    ).rejects.toThrow('smtp failed');

    const storedToken = (
      repositories.passwordResetTokenRepository.createResetToken as jest.Mock
    ).mock.calls[0][0];

    expect(
      repositories.passwordResetTokenRepository.deleteTokenByHash,
    ).toHaveBeenCalledWith(storedToken.tokenHash);
  });
});
