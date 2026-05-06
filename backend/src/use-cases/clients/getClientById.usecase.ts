import type { UserRepository } from '@/domain/repositories/user.repository';
import type { ClientDetail } from '@/types/client.type';

/**
 * Dependency interface for the use case.
 * Following the Dependency Injection pattern to keep the logic decoupled from implementation.
 */
interface Deps {
  userRepository: UserRepository;
}

/**
 *
 * Orchestrates the retrieval of detailed information for a specific client.
 * This function acts as a bridge between the delivery layer (Controllers/Hooks)
 * and the data layer (Repositories).
 *
 * @param {Deps} dependencies - Object containing required repositories.
 * @param {string} id - The unique identifier of the client.
 * @returns {Promise<ClientDetail | null>} The client details if found, otherwise null.
 */
export const getClientById = async (
  { userRepository }: Deps,
  id: string,
): Promise<ClientDetail | null> => {
  return userRepository.getClientDetail(id);
};
