/**
 * Used to localize content or handle region specific businesss logic
 */

export interface Location {
  country: string; //The full name code of the country
  currency: string; //The currency code used in this specific location
}

/**
 * Interface for a location data provider
 */
export interface ILocationRepository {
  /**
   * Fetch location of the currency and country code addociated with the IP adress
   * @param ip The IPv4 or IPv6 address string to look up
   * @returns A promise resolving to a Location object, or null.
   */
  getIp(ip: string): Promise<Location | null>;
}

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
