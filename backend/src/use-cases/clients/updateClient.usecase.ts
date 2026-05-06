import type { UserRepository } from '@/domain/repositories/user.repository';

/**
 * Data Transfer Object (DTO) for client updates.
 * Defines the specific fields that are allowed to be modified.
 */
export interface UpdateClientInput {
  conversation?: string;
}

/**
 * Dependencies required by this use case.
 * We inject the UserRepository to maintain a decoupled architecture.
 */
interface Deps {
  userRepository: UserRepository;
}

/**
 *
 * Logic to modify existing client information.
 * It receives the validated input and delegates the persistence to the repository layer.
 *
 * @param {Deps} dependencies - The repository layer dependencies.
 * @param {string} id - Unique identifier of the client to be updated.
 * @param {UpdateClientInput} input - The new data to be applied.
 * @returns {Promise<void>} Resolves when the update operation is complete.
 */
export const updateClient = async (
  { userRepository }: Deps,
  id: string,
  input: UpdateClientInput,
): Promise<void> => {
  await userRepository.updateUser(id, input);
};
