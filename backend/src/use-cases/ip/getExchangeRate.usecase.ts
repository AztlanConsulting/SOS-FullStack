import type { IExchangeRateRepository } from '@domain/ports/ILocationRepository';

/**
 *
 * A domain-level action responsible for retrieving the exchange rate
 * for a specific currency relative to the system's base currency (USD).
 *
 * Following the Dependency Inversion Principle, this function does not
 * care how the rate is fetched (API, Database, or Cache); it only
 * interacts with the repository interface.
 *
 * @param currencyCode - The ISO 4217 code to look up (e.g., "EUR", "MXN").
 * @param repository - An implementation of the IExchangeRateRepository.
 * @returns {Promise<ExchangeRate | null>} The rate data or null if the currency is unsupported.
 */
export const GetExchangeRate = async (
  currencyCode: string,
  repository: IExchangeRateRepository,
) => {
  return await repository.getRate(currencyCode);
};
