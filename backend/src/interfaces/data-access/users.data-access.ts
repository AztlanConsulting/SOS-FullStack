import type { User } from '@domain/models/user.model';
import { UserModel } from '@domain/models/user.model';
import type { UsersRepository } from '@domain/repositories/user.repository';

export const usersDataAccess: UsersRepository = {
  getUsers: function (page: number): Promise<User[]> {
    throw new Error('Function not implemented.');
  },
  getUserById: async function (id: string): Promise<User | null> {
    const user: User | null = await UserModel.findById(id).exec();
    if (user === null) return null;
    return user;
  },
  getUserByName: async function (username: string): Promise<User | null> {
    const user: User | null = await UserModel.findOne({ username }).exec();
    if (user === null) return null;
    return user;
  },
};
