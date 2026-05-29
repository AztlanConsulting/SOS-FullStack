import { useState, useCallback, useRef, useEffect } from 'react';
import { LeafletMapService } from '../services/leafletMapService';
import { PhotonGeocoding } from '@features/map/services/photonGeocodingService';
import type { GeocodingResult } from '@features/map/types/geocodingResult';

export const ADDRESS_SEARCH_MAX_LENGTH = 200;

const DEFAULT_LOCATION_LABEL = '';
const limitAddressLength = (value: string) =>
  value.slice(0, ADDRESS_SEARCH_MAX_LENGTH);

type MarkerAddressPayload = {
  coords: [number, number];
  address: string;
  properties?: {
    city?: string;
    state?: string;
    country?: string;
  };
  isComplete?: boolean;
};

/**
 * React hook that seraches the input state, result suggestions and updates the maps view upon selection.
 * @returns state and handlers for searching and selecting addresses.
 */
export function useGeocoding(
  onMarkerAddressChange?: (payload: MarkerAddressPayload) => void,
) {
  // Current text value of the search input
  const [query, setQuery] = useState(DEFAULT_LOCATION_LABEL);

  // Lists address sugestions returned from Photon
  const [results, setResults] = useState<GeocodingResult[]>([]);

  // Indicates and active network request
  const [isLoading, setIsLoading] = useState(false);

  // Stores the debounce timer reference to allow clearing previous timeouts between renders
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handles the logic as the user types it out
  const handleSearch = useCallback((value: string) => {
    const limitedValue = limitAddressLength(value);

    setQuery(limitedValue);

    // Helps us avoid API requests in the case the query is too short
    if (limitedValue.trim().length < 3) {
      setResults([]);
      return [];
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Waits 500ms after typing stops before calling the API to reduce unnecessary requests
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);

      const found = await PhotonGeocoding.search(limitedValue);

      setResults(found);
      setIsLoading(false);
    }, 500);
  }, []);

  // Updates the map camera, places a marker, and resets the search UI state
  const handleSelect = useCallback((result: GeocodingResult) => {
    LeafletMapService.flyTo(result.coords);
    LeafletMapService.placeMarker(result.coords, false);

    setQuery(limitAddressLength(result.displayName));
    setResults([]);
  }, []);

  useEffect(() => {
    const unsubscribe = LeafletMapService.onMarkerMove(async (coords) => {
      setResults([]);
      const result = await PhotonGeocoding.reverse(coords);

      if (result) {
        const address = limitAddressLength(result.displayName);

        setQuery(address);
        const isComplete = Boolean(
          result.properties?.city &&
          result.properties?.state &&
          result.properties?.country,
        );
        onMarkerAddressChange?.({
          coords: result.coords,
          address,
          properties: result.properties,
          isComplete,
        });
      } else {
        onMarkerAddressChange?.({
          coords,
          address: '',
          properties: undefined,
          isComplete: false,
        });
      }
    });

    return () => {
      unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [onMarkerAddressChange]);

  return { query, results, isLoading, handleSearch, handleSelect };
}
