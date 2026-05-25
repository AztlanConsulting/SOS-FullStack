import type { UserRepository } from '@/domain/repositories/user.repository';

/**
 * Input parameters for the GetClients use case.
 */
export interface GetClientsInput {
  page: number;
  search?: string;
}

/**
 * Data structure for a single client row in a list view.
 * This interface flattens the relationship between User, Pet, and Plan
 * for easier consumption by the UI.
 */
export interface ClientsListItem {
  _id: string;
  username: string;
  email: string;
  phone: string;
  conversation?: string;
  pet?: { _id: string; name: string; species: string };
  plan?: { _id: string; name: string; status: string; expirationDate?: Date };
}

/**
 * The standardized result of the GetClients operation,
 * including data and pagination metadata.
 */
export interface GetClientsResult {
  clients: ClientsListItem[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Dependencies required for the use case.
 * Adheres to Dependency Injection principles for better testability.
 */
interface Deps {
  userRepository: UserRepository;
}

/**
 * Use Case: GetClients
 *
 * Orchestrates the retrieval of users along with their pet and plan information.
 * This logic serves as the bridge between the delivery layer (Controllers)
 * and the data layer (Repositories).
 *
 * @param {Deps} deps - The injected repository dependencies.
 * @param {GetClientsInput} input - Pagination and search criteria.
 * @returns {Promise<GetClientsResult>} The paginated list of clients.
 */
export const getClients = async (
  { userRepository }: Deps,
  input: GetClientsInput,
): Promise<GetClientsResult> => {
  return userRepository.getUsersWithPets(input.page, input.search);
};
