import type { User } from '@domain/models/user.model';

export interface UsersRepository {
  getUsers(page: number): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByName(username: string): Promise<User | null>;
}
