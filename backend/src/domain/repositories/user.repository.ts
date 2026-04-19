import type { User } from '@domain/models/user.model';
import type { Role } from '../models/role.model';
import type { PopulatedPermission } from '@validation/auth.types';

type UserWithRole = Omit<User, 'roleId'> & {
  roleId: Role;
};

export interface UserRepository {
  getUsers(page: number): Promise<User[]>;
  getUserById(id: string): Promise<UserWithRole | null>;
  getUserByName(username: string): Promise<UserWithRole | null>;
  getUserByEmail(email: string): Promise<UserWithRole | null>;
  getUserPermissions(userId: string): Promise<PopulatedPermission[]>;
}
