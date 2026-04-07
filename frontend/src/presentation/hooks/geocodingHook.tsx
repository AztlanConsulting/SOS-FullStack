import { useState, useCallback } from 'react';
import type { IGeocodingService } from '../../domain/model/map/geocodingService';
import type { ImapService } from '../../domain/model/map/mapService';
import type { GeocodingResult } from '../../domain/model/map/geocodingResult';
import { searchAdressUseCase } from '../../use-cases/maps/searchAdressUseCase';

/**
 * React hook that seraches the input state, result suggestions and updates the maps view upon selection.
 * @param geocodingService Its the one that fetches adress suggestions.
 * @param mapService The implementation used to manipulate the map.
 * @returns state and handlers for searching and selecting addresses.
 */
export function useGeocoding(
  geocodingService: IGeocodingService,
  mapService: ImapService,
) {
  //Current text value of the search input
  const [query, setQuery] = useState('');
  //Lists address sugestions returned from Photon
  const [results, setResults] = useState<GeocodingResult[]>([]);
  //Indicates and active network request
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the logic as the user types it out
   */
  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (value.trim().length < 3) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      const found = await searchAdressUseCase(geocodingService, value);
      setResults(found);
      setIsLoading(false);
    },
    [geocodingService],
  );

  /**
   *Updates the map camera, places a marker, and resets the search UI state.
   */
  const handleSelect = useCallback(
    (results: GeocodingResult) => {
      mapService.flyTo(results.coords);
      mapService.placeMarker(results.coords);
      setQuery(results.displayName);
      setResults([]);
    },
    [mapService],
  );

  return { query, results, isLoading, handleSearch, handleSelect };
}
