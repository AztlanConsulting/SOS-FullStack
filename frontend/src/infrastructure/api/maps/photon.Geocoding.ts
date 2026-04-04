import type { IGeocodingService } from '../../../domain/model/map/geocodingService';
import type { GeocodingResult } from '../../../domain/model/map/geocodingResult';

/**
 * Provides the atcion that transforms text queries into location data.
 */
export const PhotonGeocoding: IGeocodingService = {
  /**
   * Performs a serach request to the Photon API
   * @param query The location of the string to search for
   * @returns a maximun of 5 Geocoding results, or an empty list.
   */

  async search(query: string): Promise<GeocodingResult[]> {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`,
    );
    //Returns empty results if the network reuqest fails
    if (!res.ok) return [];

    const data = await res.json();

    //Ensures that the response contains the GeoJSON features array
    if (!data.features) return [];

    return data.features.map((feature: any) => ({
      // Photon is given the adress and it will return the coordinates
      displayName: [
        feature.properties.name,
        feature.properties.city,
        feature.properties.country,
      ]
        .filter(Boolean)
        .join(', '),
      coords: [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ] as [number, number],
    }));
  },
};
