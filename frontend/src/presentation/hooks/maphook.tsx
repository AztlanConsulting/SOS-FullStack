import { useState, useEffect } from 'react';
import type { ImapService } from '../../domain/model/map/mapService';
/**
 * A custom react Hook that manages the lifecycle and state of the map instance.
 * @param initializeMapUseCase The use case function that triggers the map setup.
 * @param mapService The infraestructure implemetation of the map service.
 * @param divID The ID of the HTML element where the map should be mounted.
 * @returns
 */
export function UseMap(
  initializeMapUseCase: (
    mapService: ImapService,
    divID: string,
    coords: [number, number],
    onMove: (lat: number, lng: number) => void,
  ) => void,
  mapService: ImapService,
  divID: string,
) {
  /**
   *Defaults coordinates to Mexico City [19.4326, -99.1332].
   */
  const [coords, setCoords] = useState<[number, number]>([19.4326, -99.1332]);

  //Initializes the map once the component mounts and passes the use case to update state whenever the map finishes moving.
  useEffect(() => {
    initializeMapUseCase(
      mapService,
      divID,
      coords,
      (newLat: number, newLng: number) => {
        setCoords([newLat, newLng]);
      },
    );
    //Empty array to ensure that the initialization happens once.
  }, []);

  return { coords };
}
