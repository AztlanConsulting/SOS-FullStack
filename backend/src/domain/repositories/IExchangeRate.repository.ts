/**
 * Represents the exchange rate data for a given currency relative to USD.
 */
export interface ExchangeRate {
  currencyCode: string; //The currency code of the exchange rate
  rate: number; //The exchange rate value
}

/**
 * Interface for an exchange rate data provider.
 */
export interface IExchangeRateRepository {
  /**
   * Fetch the exchange rate for a given currency code relative to USD.
   * @param currencyCode The ISO 4217 currency code
   * @returns A promise resolving to an ExchangeRate object, or null if unsupported/failed.
   */
  getRate(currencyCode: string): Promise<ExchangeRate | null>;
}
