import type { GeocodingResult } from '../../domain/model/map/geocodingResult';
import type { IGeocodingService } from '../../domain/model/map/geocodingService';

/**
 * Executes the use case yo search for an adress based on a text query.
 * @param geocodingService Implements the geocoding logic of Photon.
 * @param query The search that the user wrote.
 * @returns A promise of an array with the geocodingResults, or in its case an empty one.
 */

export const searchAdressUseCase = async (
  geocodingService: IGeocodingService,
  query: string,
): Promise<GeocodingResult[]> => {
  //Helps us avoid API requests in the case the query is too short
  if (query.trim().length < 3) return [];
  return geocodingService.search(query);
};
