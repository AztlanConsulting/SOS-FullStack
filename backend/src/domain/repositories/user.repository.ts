import type { User } from '@domain/models/user.model';
import type { PopulatedPermission } from '@validation/auth.types';

export interface UserRepository {
  getUsers(page: number): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByName(username: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserPermissions(userId: string): Promise<PopulatedPermission[]>;
}
