import { getUserById } from '@use-cases/auth/getUser.usecase';
import type { UserRepository } from '@domain/repositories/user.repository';

describe('getUserById use-case (unit)', () => {
  // Mock user returned from repository
  const mockUser = {
    _id: 'user-id',
    username: 'test',
    email: 'test@test.com',
    roleId: { role: 'admin' },
    active: true,
  };

  test('returns safe user DTO', async () => {
    // Create partial mock of repository
    const repo: Partial<UserRepository> = {
      getUserById: jest.fn().mockResolvedValue(mockUser),
    };

    const result = await getUserById(repo as UserRepository, 'user-id');

    // Verify repository call
    expect(repo.getUserById).toHaveBeenCalledWith('user-id');

    // Verify mapped safe DTO
    expect(result).toEqual({
      _id: mockUser._id,
      username: mockUser.username,
      email: mockUser.email,
      role: 'admin',
      active: true,
    });
  });

  test('throws if user not found', async () => {
    // Mock repository returning null
    const repo: Partial<UserRepository> = {
      getUserById: jest.fn().mockResolvedValue(null),
    };

    // Expect USER_NOT_FOUND error
    await expect(getUserById(repo as UserRepository, 'id')).rejects.toThrow(
      'USER_NOT_FOUND',
    );
  });

  test('throws if user inactive', async () => {
    // Mock repository returning inactive user
    const repo: Partial<UserRepository> = {
      getUserById: jest.fn().mockResolvedValue({
        ...mockUser,
        active: false,
      }),
    };

    // Expect USER_DEACTIVATED error
    await expect(getUserById(repo as UserRepository, 'id')).rejects.toThrow(
      'USER_DEACTIVATED',
    );
  });
});
