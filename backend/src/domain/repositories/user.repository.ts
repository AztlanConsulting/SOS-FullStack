import type {
  User,
  UserCreateInput,
  UserWithRole,
} from '@domain/models/user.model';
import type { PopulatedPermission } from '@validation/auth.types';

export interface UserRepository {
  getUsers(page: number): Promise<User[]>;
  getUserById(id: string): Promise<UserWithRole | null>;
  getUserByName(username: string): Promise<UserWithRole | null>;
  getUserByEmail(email: string): Promise<UserWithRole | null>;
  getUserPermissions(userId: string): Promise<PopulatedPermission[]>;
  createUser(userData: UserCreateInput): Promise<string>;
}
