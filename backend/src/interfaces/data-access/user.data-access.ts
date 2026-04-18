import type { User } from '@domain/models/user.model';
import { UserModel } from '@domain/models/user.model';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { PopulatedPermission } from '@validation/auth.types';
import type { UserPermissions } from '@validation/auth.types';

export const userDataAccess: UserRepository = {
  /**
   * Retrieves a paginated list of users.
   * Uses fixed pagination (limit = 10).
   *
   * @param page - Page number (1-based)
   * @return List of users for the requested page
   */
  getUsers: async function (page: number): Promise<User[]> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await UserModel.find()
      .lean<User[]>()
      .skip(skip)
      .limit(limit)
      .exec();

    return users;
  },

  /**
   * Finds a user by ID.
   *
   * @param id - User ID
   * @return User if found, otherwise null
   */
  getUserById: async function (id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean<User>().exec();

    return user;
  },

  /**
   * Finds a user by username.
   *
   * @param username - Username to search
   * @return User if found, otherwise null
   */
  getUserByName: async function (username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username }).lean<User>().exec();

    return user;
  },

  /**
   * Finds a user by email.
   * Normalizes input to match stored lowercase/trimmed format.
   *
   * @param email - Email to search
   * @return User if found, otherwise null
   */
  getUserByEmail: async function (email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
      .lean<User>()
      .exec();

    return user;
  },

  /**
   * Resolves effective permissions for a user by combining:
   * - Role-based permissions
   * - User-specific permission overrides
   *
   * @param userId - User ID
   * @return Combined list of permissions
   */
  getUserPermissions: async function (
    userId: string,
  ): Promise<PopulatedPermission[]> {
    const user = await UserModel.findById(userId)
      .populate({
        path: 'roleId',
        populate: {
          path: 'permissions',
          populate: {
            path: 'resourceId',
            select: 'name',
          },
        },
      })
      .populate({
        path: 'permissions',
        populate: {
          path: 'resourceId',
          select: 'name',
        },
      })
      .lean<UserPermissions>();

    if (!user) return [];

    // Extract permissions from role and user-level overrides
    const rolePermissions = user.roleId?.permissions ?? [];
    const userPermissions = user.permissions ?? [];

    return [...rolePermissions, ...userPermissions];
  },
};
