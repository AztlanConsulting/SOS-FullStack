import type { UserRepository } from '@/domain/repositories/user.repository';

export interface UpdateClientInput {
  conversation?: string;
}

interface Deps {
  userRepository: UserRepository;
}

export const updateClient = async (
  { userRepository }: Deps,
  id: string,
  input: UpdateClientInput,
): Promise<void> => {
  await userRepository.updateUser(id, input);
};
