import type { GetClientsResult } from '@/use-cases/clients/getClients.usecase';
import type {
  User,
  UserCreateInput,
  UserWithRole,
} from '@domain/models/user.model';
import type { PopulatedPermission } from '@validation/auth.types';
import type { ClientDetail } from '@/types/client.type';

export interface UserRepository {
  getUsers(page: number): Promise<User[]>;
  getUserById(id: string): Promise<UserWithRole | null>;
  getUserByName(username: string): Promise<UserWithRole | null>;
  getUserByEmail(email: string): Promise<UserWithRole | null>;
  getUserPermissions(userId: string): Promise<PopulatedPermission[]>;
  createUser(userData: UserCreateInput): Promise<string>;
  getUsersWithPets(page: number, search?: string): Promise<GetClientsResult>;
  getClientDetail(id: string): Promise<ClientDetail | null>;
}
