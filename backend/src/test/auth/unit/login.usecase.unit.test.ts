import bcrypt from 'bcryptjs';
import { loginUser } from '@use-cases/auth/login.usecase';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';

jest.mock('bcryptjs');

describe('loginUser use-case (unit)', () => {
  // Mock user returned from repository
  const mockUser = {
    _id: 'user-id',
    email: 'test@test.com',
    password: 'hashed-password',
    username: 'test',
    roleId: { role: 'admin' },
    active: true,
  };

  // Input credentials for login
  const input = {
    email: 'test@test.com',
    password: '123456',
    remember: true,
  };

  test('returns user and tokens when credentials are valid', async () => {
    // Mock user repository with valid user
    const userRepo: Partial<UserRepository> = {
      getUserByEmail: jest.fn().mockResolvedValue(mockUser),
    };

    // Mock refresh token repository
    const tokenRepo: Partial<RefreshTokenRepository> = {
      storeRefreshToken: jest.fn().mockResolvedValue(undefined),
    };

    // Simulate successful password comparison
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await loginUser(
      userRepo as UserRepository,
      tokenRepo as RefreshTokenRepository,
      input,
    );

    // Verify user lookup
    expect(userRepo.getUserByEmail).toHaveBeenCalledWith(input.email);

    // Verify password comparison
    expect(bcrypt.compare).toHaveBeenCalledWith(
      input.password,
      mockUser.password,
    );

    // Verify refresh token storage
    expect(tokenRepo.storeRefreshToken).toHaveBeenCalled();

    // Verify returned safe user DTO
    expect(result.user).toEqual({
      _id: mockUser._id,
      username: mockUser.username,
      email: mockUser.email,
      role: mockUser.roleId.role,
      active: true,
    });

    // Verify tokens exist
    expect(result.tokens.accessToken).toBeDefined();
    expect(result.tokens.refreshToken).toBeDefined();
  });

  test('throws error when user does not exist', async () => {
    // Mock repository returning null user
    const userRepo: Partial<UserRepository> = {
      getUserByEmail: jest.fn().mockResolvedValue(null),
    };

    // Empty token repository mock
    const tokenRepo: Partial<RefreshTokenRepository> = {};

    // Expect INVALID_CREDENTIALS error
    await expect(
      loginUser(
        userRepo as UserRepository,
        tokenRepo as RefreshTokenRepository,
        input,
      ),
    ).rejects.toThrow('INVALID_CREDENTIALS');
  });

  test('throws error when password is invalid', async () => {
    // Mock repository returning valid user
    const userRepo: Partial<UserRepository> = {
      getUserByEmail: jest.fn().mockResolvedValue(mockUser),
    };

    const tokenRepo: Partial<RefreshTokenRepository> = {};

    // Simulate failed password comparison
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // Expect INVALID_CREDENTIALS error
    await expect(
      loginUser(
        userRepo as UserRepository,
        tokenRepo as RefreshTokenRepository,
        input,
      ),
    ).rejects.toThrow('INVALID_CREDENTIALS');
  });

  test('throws error when user is inactive', async () => {
    // Mock repository returning inactive user
    const userRepo: Partial<UserRepository> = {
      getUserByEmail: jest.fn().mockResolvedValue({
        ...mockUser,
        active: false,
      }),
    };

    const tokenRepo: Partial<RefreshTokenRepository> = {};

    // Expect USER_DEACTIVATED error
    await expect(
      loginUser(
        userRepo as UserRepository,
        tokenRepo as RefreshTokenRepository,
        input,
      ),
    ).rejects.toThrow('USER_DEACTIVATED');
  });
});
