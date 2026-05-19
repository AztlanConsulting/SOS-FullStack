import type { UserRepository } from '@/domain/repositories/user.repository';

/**
 * Represents a demographic data point grouping clients by their location.
 * Used primarily for populating administrative analytics dashboards (e.g., Geo Maps or Bar charts).
 */
export interface CountryMetric {
  name: string;
  value: number;
}

/**
 * Dependencies required for the use case execution.
 * Injected via the controller layer to maintain a decoupled, testable architecture.
 */
interface Deps {
  userRepository: UserRepository;
}

/**
 * * An Application Service that coordinates the retrieval of client distribution
 * broken down by country. This metrics use case helps the business analyze
 * regional market penetration and user growth.
 * * Architecture Role:
 * - Serves as an orchestrator within the Domain/Application layer.
 * - Abstracts the data access layer from the controller.
 * * @param {Deps} deps - Object containing the injected UserRepository implementation.
 * @returns {Promise<CountryMetric[]>} A list of metrics matching countries to client counts.
 */
export const getClientsByCountry = async ({
  userRepository,
}: Deps): Promise<CountryMetric[]> => {
  return userRepository.getClientsByCountry();
};
