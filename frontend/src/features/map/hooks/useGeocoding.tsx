import { useState, useCallback, useRef } from 'react';
import { LeafletMapService } from '../services/leafletMapService';
import { PhotonGeocoding } from '@features/map/services/photonGeocodingService';
import type { GeocodingResult } from '@features/map/types/geocodingResult';

/**
 * React hook that seraches the input state, result suggestions and updates the maps view upon selection.
 * @returns state and handlers for searching and selecting addresses.
 */
export function useGeocoding() {
  // Current text value of the search input
  const [query, setQuery] = useState('');

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
    LeafletMapService.placeMarker(result.coords);

    setQuery(result.displayName);
    setResults([]);
  }, []);

  return { query, results, isLoading, handleSearch, handleSelect };
}
