import type { GeocodingResult } from './geocodingResult';

//Defines the contract for converting human-readable search strings into geographic data.
export interface IGeocodingService {
  /**
   * Searches for locations based on a text query.
   * @param query - The address, city, or landmark string to search for
   * @returns Promise that resolves to an array of GeocodingResult objects containing coordinates and names
   */

  search(query: string): Promise<GeocodingResult[]>;
}
