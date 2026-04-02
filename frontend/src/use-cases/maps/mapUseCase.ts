import type { ImapService } from '../../domain/model/map/mapService';

/**
 * Executes the use case to initialize the map logic.
 * Its also the one that sets up the map service with a specific container and coordinates.
 * @param mapService The implementation of the map service (Leaflet).
 * @param divID The HTML ID of the container where the map will be displayed.
 * @param coords Tuple representing the initial latitude and longitude.
 * @param onMove Optional callback function that handles the map movements.
 */
export const initializeMapUseCase = (
  mapService: ImapService,
  divID: string,
  coords: [number, number],
  onMove?: (lat: number, lng: number) => void,
): void => {
  mapService.init(coords, divID, onMove);
};
