import { useCallback, useEffect, useRef, useState } from 'react';
import type { PetReportData } from '../types/petReport.types.ts';
import { useGeocoding } from '../../map/hooks/useGeocoding.tsx';
import { useMap } from '../../map/hooks/useMap.tsx';
import { LeafletMapService } from '../../map/services/leafletMapService.ts';

export const usePetLocation = (
  mapID: string,
  formData: Partial<PetReportData>,
  updateForm: (newData: Partial<PetReportData>) => void,
) => {
  const { coords } = useMap(
    mapID,
    useCallback(
      (lat: number, lng: number) => {
        LeafletMapService.placeMarker([lat, lng]);
        updateForm({ locationCoords: [lat, lng] });
      },
      [updateForm],
    ),
  );
  const { query, results, isLoading, handleSearch, handleSelect } =
    useGeocoding();

  const mapReadyRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (formData.locationCoords && !mapReadyRef.current) {
      const timer = setTimeout(() => {
        LeafletMapService.flyTo(formData.locationCoords as [number, number]);
        mapReadyRef.current = true;
      }, 350);
      return () => clearTimeout(timer);
    } else {
      mapReadyRef.current = true;
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
      updateForm({ locationCoords: coords });
    }
  }, [coords]);

  const onSelectAddress = (result: any) => {
    handleSelect(result);
    setHasInteracted(true);
    updateForm({ address: result.displayName, location: result });
  };

  const onSearchWrapper = (val: string) => {
    setHasInteracted(true);
    handleSearch(val);
  };

  const displayValue = hasInteracted ? query : formData.address || '';

  return { results, isLoading, displayValue, onSelectAddress, onSearchWrapper };
};
