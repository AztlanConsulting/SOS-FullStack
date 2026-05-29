import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ADDRESS_SEARCH_MAX_LENGTH,
  useGeocoding,
} from '../../map/hooks/useGeocoding';
import { useMap } from '../../map/hooks/useMap';
import { LeafletMapService } from '../../map/services/leafletMapService';
import type { GeocodingResult } from '../../map/types/geocodingResult';
import type { LostPetReportData } from '@/shared/types/petReport.types';

const limitAddressLength = (value = '') =>
  value.slice(0, ADDRESS_SEARCH_MAX_LENGTH);

// Keep the map centered on a default location, but do not prefill the input value.
export const usePetLocation = (
  mapID: string,
  formData: Partial<LostPetReportData>,
  updateForm: (newData: Partial<LostPetReportData>) => void,
) => {
  const { coords } = useMap(mapID);

  const updateFormRef = useRef(updateForm);
  updateFormRef.current = updateForm;

  const [locationError, setLocationError] = useState<string | null>(null);

  const onMarkerAddressChange = useCallback(
    ({
      coords: markerCoords,
      address,
      properties,
      isComplete,
    }: {
      coords: [number, number];
      address: string;
      properties?: { city?: string; state?: string; country?: string };
      isComplete?: boolean;
    }) => {
      // If the reverse geocode couldn't provide full city/state/country, surface an error
      if (!isComplete) {
        setLocationError(
          'No podemos determinar ciudad/estado/país para esta ubicación. Intenta mover el pin o seleccionar otra ubicación.',
        );
        return;
      }

      setLocationError(null);
      const markerLocation: GeocodingResult = {
        coords: markerCoords,
        displayName: address,
        properties,
      };
      updateFormRef.current({
        address,
        locationCoords: markerCoords,
        location: markerLocation,
      });
    },
    [],
  );

  const { query, results, isLoading, handleSearch, handleSelect } =
    useGeocoding(onMarkerAddressChange);

  const mapReadyRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (formData.locationCoords && !mapReadyRef.current) {
      const timer = setTimeout(() => {
        LeafletMapService.flyTo(formData.locationCoords as [number, number]);
        LeafletMapService.placeMarker(
          formData.locationCoords as [number, number],
        );
        mapReadyRef.current = true;
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        LeafletMapService.flyTo(coords);
        LeafletMapService.placeMarker(coords, false);
        mapReadyRef.current = true;
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    return () => {
      LeafletMapService.destroyMap?.(mapID);
      mapReadyRef.current = false;
    };
  }, [mapID]);

  useEffect(() => {
    if (coords && mapReadyRef.current) {
      updateFormRef.current({ locationCoords: coords });
    }
  }, [coords]);

  const onSelectAddress = (result: any) => {
    handleSelect(result);
    setHasInteracted(true);
    const address = limitAddressLength(result.displayName);
    const isComplete = Boolean(
      result?.properties?.city &&
      result?.properties?.state &&
      result?.properties?.country,
    );

    if (!isComplete) {
      setLocationError(
        'No podemos determinar ciudad/estado/país para esta ubicación. Intenta seleccionar otra ubicación.',
      );
      return;
    }

    setLocationError(null);
    updateFormRef.current({
      address,
      location: {
        ...result,
        displayName: address,
      },
      locationCoords: result.coords,
    });
  };

  const onSearchWrapper = (val: string) => {
    setHasInteracted(true);
    handleSearch(limitAddressLength(val));
  };

  const onFocusWrapper = () => {
    updateFormRef.current({ address: limitAddressLength(formData.address) });
  };

  // If the user hasn't interacted, keep the input empty (show placeholder).
  // The map will still initialize to the default coords via `useMap`.
  const displayValue = limitAddressLength(
    hasInteracted ? query : formData.address,
  );

  return {
    results,
    isLoading,
    displayValue,
    onSelectAddress,
    onSearchWrapper,
    onFocusWrapper,
    locationError,
  };
};
