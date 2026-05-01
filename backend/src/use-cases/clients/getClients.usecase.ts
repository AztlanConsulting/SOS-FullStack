import type { UserRepository } from '@/domain/repositories/user.repository';

export interface GetClientsInput {
  page: number;
  search?: string;
}

export interface ClientsListItem {
  _id: string;
  username: string;
  email: string;
  phone: string;
  conversation?: string;
  pet?: { _id: string; name: string; species: string };
  plan?: { _id: string; name: string; status: string; expirationDate?: Date };
}

export interface GetClientsResult {
  clients: ClientsListItem[];
  total: number;
  page: number;
  totalPages: number;
}

interface Deps {
  userRepository: UserRepository;
}

export const getClients = async (
  { userRepository }: Deps,
  input: GetClientsInput,
): Promise<GetClientsResult> => {
  return userRepository.getUsersWithPets(input.page, input.search);
};
