import { useState } from 'react';
import { LeafletMapService } from '@features/map/services/leafletMapService';

export const useGeolocation = () => {
  const [isLocating, setIsLocating] = useState(false);

  const goToMyLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Tu navegador no soporta la geolocalización.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        LeafletMapService.flyTo(coords);
        LeafletMapService.placeMarker(coords);

        setIsLocating(false);
      },
      (error) => {
        console.error('Error obteniendo la ubicación:', error);
        alert(
          'No pudimos acceder a tu ubicación. Por favor, verifica los permisos de tu navegador.',
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return {
    isLocating,
    goToMyLocation,
  };
};
