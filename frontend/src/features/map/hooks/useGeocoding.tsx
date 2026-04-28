import { useState, useCallback, useRef, useEffect } from 'react';
import { LeafletMapService } from '../services/leafletMapService';
import { PhotonGeocoding } from '@features/map/services/photonGeocodingService';
import type { GeocodingResult } from '@features/map/types/geocodingResult';

const DEFAULT_LOCATION_LABEL = 'Mexico City, Mexico';

type MarkerAddressPayload = {
  coords: [number, number];
  address: string;
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
    setQuery(value);

    // Helps us avoid API requests in the case the query is too short
    if (value.trim().length < 3) {
      setResults([]);
      return [];
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Waits 500ms after typing stops before calling the API to reduce unnecessary requests
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);

      const found = await PhotonGeocoding.search(value);

      setResults(found);
      setIsLoading(false);
    }, 500);
  }, []);

  // Updates the map camera, places a marker, and resets the search UI state
  const handleSelect = useCallback((result: GeocodingResult) => {
    LeafletMapService.flyTo(result.coords);
    LeafletMapService.placeMarker(result.coords, false);

    setQuery(result.displayName);
    setResults([]);
  }, []);

  useEffect(() => {
    const unsubscribe = LeafletMapService.onMarkerMove(async (coords) => {
      setResults([]);
      const address = await PhotonGeocoding.reverse(coords);

      if (address) {
        setQuery(address);
        onMarkerAddressChange?.({ coords, address });
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
