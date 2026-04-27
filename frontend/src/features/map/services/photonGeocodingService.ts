import type { GeocodingResult } from '@features/map/types/geocodingResult';

/**
 * Provides the atcion that transforms text queries into location data.
 */
export const PhotonGeocoding = {
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

  async reverse(coords: [number, number]): Promise<string | null> {
    const [lat, lon] = coords;

    const res = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`,
    );

    if (!res.ok) return null;

    const data = await res.json();
    const feature = data?.features?.[0];
    if (!feature?.properties) return null;

    const props = feature.properties;

    const address = [props.name, props.street, props.city, props.country]
      .filter(Boolean)
      .join(', ')
      .trim();

    return address || null;
  },
};
