import { useState, useCallback, useRef, useEffect } from 'react';
import { LeafletMapService } from '../services/leafletMapService';
import { PhotonGeocoding } from '@features/map/services/photonGeocodingService';
import type { GeocodingResult } from '@features/map/types/geocodingResult';

export const ADDRESS_SEARCH_MAX_LENGTH = 200;

const DEFAULT_LOCATION_LABEL = '';
const REVERSE_GEOCODING_DEBOUNCE_MS = 350;
const limitAddressLength = (value: string) =>
  value.slice(0, ADDRESS_SEARCH_MAX_LENGTH);

const getCoordsKey = ([lat, lng]: [number, number]) => `${lat},${lng}`;

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
  const reverseDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingReverseCoordsRef = useRef<string | null>(null);
  const reverseGeocodingCacheRef = useRef(
    new Map<string, MarkerAddressPayload>(),
  );

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
    const updateMarkerAddress = (payload: MarkerAddressPayload) => {
      if (payload.address) {
        setQuery(limitAddressLength(payload.address));
      }
      onMarkerAddressChange?.(payload);
    };

    const unsubscribe = LeafletMapService.onMarkerMove((coords) => {
      const coordsKey = getCoordsKey(coords);
      const cachedPayload = reverseGeocodingCacheRef.current.get(coordsKey);

      setResults([]);

      if (cachedPayload) {
        updateMarkerAddress(cachedPayload);
        return;
      }

      if (pendingReverseCoordsRef.current === coordsKey) {
        return;
      }

      pendingReverseCoordsRef.current = coordsKey;

      if (reverseDebounceRef.current) {
        clearTimeout(reverseDebounceRef.current);
      }

      reverseDebounceRef.current = setTimeout(async () => {
        const result = await PhotonGeocoding.reverse(coords);
        let payload: MarkerAddressPayload;

        if (result) {
          const address = limitAddressLength(result.displayName);
          const isComplete = Boolean(
            result.properties?.city &&
            result.properties?.state &&
            result.properties?.country,
          );

          payload = {
            coords: result.coords,
            address,
            properties: result.properties,
            isComplete,
          };
        } else {
          payload = {
            coords,
            address: '',
            properties: undefined,
            isComplete: false,
          };
        }

        reverseGeocodingCacheRef.current.set(coordsKey, payload);
        pendingReverseCoordsRef.current = null;
        updateMarkerAddress(payload);
      }, REVERSE_GEOCODING_DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (reverseDebounceRef.current) {
        clearTimeout(reverseDebounceRef.current);
      }
      pendingReverseCoordsRef.current = null;
    };
  }, [onMarkerAddressChange]);

  return { query, results, isLoading, handleSearch, handleSelect };
}
