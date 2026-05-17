import { useEffect, type SetStateAction } from 'react';
import type { FoundPetReportData } from '../types/petReport.types';
import { PhotonGeocoding } from '@/features/map/services/photonGeocodingService';
import type { Properties } from '@/features/map/types/geocodingResult';

// Update location and makes sure city is defined as the city by OSM.
// If OSM doesn't have city, PhotonGeocoding gets the city and safely inserts
// it into the formData report
// Priority - city | state | missing info message
function useUpdatePetLocation<T extends FoundPetReportData>(
  formData: T,
  setFormData: (value: SetStateAction<T>) => void,
) {
  const hasCity = formData.location?.properties
    ? Object.keys(formData.location?.properties).includes('city')
    : false;

  const city = hasCity && formData.location?.properties.city;

  useEffect(() => {
    if (formData.location?.coords && !city) {
      PhotonGeocoding.geocoding(formData.location?.coords)
        .then((p: Properties | null) => {
          if (p === null)
            throw Error(`fetching coords - ${formData.location?.coords}`);
          p.city = p?.city ?? p?.state ?? 'Sin ciudad o estado';
          setFormData((prev: T) => ({
            ...prev,
            ...locationLogic<T>(prev, p),
          }));
        })
        .catch((error) => {
          console.error('Error updating PetReportForm: ', error);
        });
    }
  }, [formData.location?.coords]);
}

// Safely insert location properties into the report
function locationLogic<T extends FoundPetReportData>(prev: T, p: Properties) {
  return prev.location && p
    ? {
        location: {
          ...prev.location,
          properties: {
            city: p.city,
            country: p.country,
            state: p.state,
          },
        },
      }
    : {};
}

export default useUpdatePetLocation;
