import type { Location } from '../models/location';

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
