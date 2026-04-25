import { useEffect, useRef, useState } from 'react';
import type { PetReportData } from '../types/petReport.types';
import { useGeocoding } from '../../map/hooks/useGeocoding';
import { useMap } from '../../map/hooks/useMap';
import { LeafletMapService } from '../../map/services/leafletMapService';
import type { GeocodingResult } from '../../map/types/geocodingResult';

const DEFAULT_LOCATION_LABEL = 'Mexico City, Mexico';

export const usePetLocation = (
  mapID: string,
  formData: Partial<PetReportData>,
  updateForm: (newData: Partial<PetReportData>) => void,
) => {
  const { coords } = useMap(mapID);
  const { query, results, isLoading, handleSearch, handleSelect } =
    useGeocoding(({ coords: markerCoords, address }) => {
      const markerLocation: GeocodingResult = {
        coords: markerCoords,
        displayName: address,
      };

      updateForm({
        address,
        locationCoords: markerCoords,
        location: markerLocation,
      });
    });

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
    updateForm({ address: formData.address || '' });
    handleSearch(val);
  };

  const onFocusWrapper = () => {
    updateForm({ address: formData.address || '' });
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
