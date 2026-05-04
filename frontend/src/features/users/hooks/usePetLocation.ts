import { useEffect, useRef, useState, useCallback } from 'react';
import { useGeocoding } from '../../map/hooks/useGeocoding';
import { useMap } from '../../map/hooks/useMap';
import { LeafletMapService } from '../../map/services/leafletMapService';
import type { GeocodingResult } from '../../map/types/geocodingResult';
import type { LostPetReportData } from '@/shared/types/petReport.types';

const DEFAULT_LOCATION_LABEL = 'Mexico City, Mexico';

export const usePetLocation = (
  mapID: string,
  formData: Partial<LostPetReportData>,
  updateForm: (newData: Partial<LostPetReportData>) => void,
) => {
  const { coords } = useMap(mapID);

  const updateFormRef = useRef(updateForm);
  updateFormRef.current = updateForm;

  const onMarkerAddressChange = useCallback(
    ({
      coords: markerCoords,
      address,
    }: {
      coords: [number, number];
      address: string;
    }) => {
      const markerLocation: GeocodingResult = {
        coords: markerCoords,
        displayName: address,
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
    updateFormRef.current({
      address: result.displayName,
      location: result,
      locationCoords: result.coords,
    });
  };

  const onSearchWrapper = (val: string) => {
    setHasInteracted(true);
    handleSearch(val);
  };

  const onFocusWrapper = () => {
    updateFormRef.current({ address: formData.address || '' });
  };

  const displayValue = hasInteracted
    ? query
    : formData.address || query || DEFAULT_LOCATION_LABEL;

  return {
    results,
    isLoading,
    displayValue,
    onSelectAddress,
    onSearchWrapper,
    onFocusWrapper,
  };
};
