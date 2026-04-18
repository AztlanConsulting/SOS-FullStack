import type { User } from '@domain/models/user.model';
import { UserModel } from '@domain/models/user.model';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { PopulatedPermission } from '@validation/auth.types';
import type { UserPermissions } from '@validation/auth.types';

export const userDataAccess: UserRepository = {
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

  getUserById: async function (id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean<User>().exec();

    return user;
  },

  getUserByName: async function (username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username }).lean<User>().exec();

    return user;
  },

  getUserByEmail: async function (email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
      .lean<User>()
      .exec();

    return user;
  },

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

    const rolePermissions = user.roleId?.permissions ?? [];
    const userPermissions = user.permissions ?? [];

    return [...rolePermissions, ...userPermissions];
  },
};
