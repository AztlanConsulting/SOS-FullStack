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
