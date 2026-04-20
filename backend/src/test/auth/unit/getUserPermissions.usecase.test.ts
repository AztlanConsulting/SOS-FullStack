import { getUserPermissions } from '@use-cases/auth/getUserPermissions.usecase';
import type { UserRepository } from '@domain/repositories/user.repository';

describe('getUserPermissions use-case (unit)', () => {
  // Mock permissions returned from repository
  const permissions = [
    {
      resourceId: { name: 'users' },
      actions: { create: true, read: false, update: false, delete: false },
    },
    {
      resourceId: { name: 'users' },
      actions: { create: false, read: true, update: false, delete: false },
    },
  ];

  test('aggregates permissions correctly', async () => {
    // Mock repository with active user and permissions
    const repo: Partial<UserRepository> = {
      getUserById: jest.fn().mockResolvedValue({ active: true }),
      getUserPermissions: jest.fn().mockResolvedValue(permissions),
    };

    const result = await getUserPermissions(repo as UserRepository, 'user-id');

    // Verify aggregated permissions result
    expect(result).toEqual({
      users: {
        create: true,
        read: true,
        update: false,
        delete: false,
      },
    });
  });

  test('throws if user not found', async () => {
    // Mock repository returning null user
    const repo: Partial<UserRepository> = {
      getUserById: jest.fn().mockResolvedValue(null),
    };

    // Expect USER_NOT_FOUND error
    await expect(
      getUserPermissions(repo as UserRepository, 'id'),
    ).rejects.toThrow('USER_NOT_FOUND');
  });
});
