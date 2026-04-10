import { useState, useEffect } from 'react';
import { LeafletMapService } from '@features/map/services/leafletMapService';

/**
 * A custom react Hook that manages the lifecycle and state of the map instance.
 * @param divID The ID of the HTML element where the map should be mounted.
 * @returns
 */
export function useMap(divID: string) {
  // Defaults coordinates to Mexico City [19.4326, -99.1332]
  const [coords, setCoords] = useState<[number, number]>([19.4326, -99.1332]);

  // Initializes the map once the component mounts and updates state whenever the map finishes moving
  useEffect(() => {
    LeafletMapService.init(divID ? coords : coords, divID, (lat, lng) => {
      setCoords([lat, lng]);
    });
  }, []);

  return { coords };
}
