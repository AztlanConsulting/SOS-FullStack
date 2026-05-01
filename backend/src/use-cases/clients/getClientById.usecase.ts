import type { UserRepository } from '@/domain/repositories/user.repository';
import type { ClientDetail } from '@/types/client.type';

interface Deps {
  userRepository: UserRepository;
}

export const getClientById = async (
  { userRepository }: Deps,
  id: string,
): Promise<ClientDetail | null> => {
  return userRepository.getClientDetail(id);
};
