import type { ImapService } from '../../domain/model/map/mapService';

export const initializeMapUseCase = (
  mapService: ImapService,
  divID: string,
): void => {
  mapService.init([19.4326, -99.1332], divID);
};
