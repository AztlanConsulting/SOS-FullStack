import type { Request, Response } from 'express';
import { IpApiService } from '@infrastructure/api/IpApiService';
import { GetLocationByIp } from '@use-cases/ip/GetLocationByIp';
import { resolveRequestIp } from '../../utils/resolveRequestIp';

/**
 * Orchestrates the flow between the incoming request, the domain use case, and the final response.
 */
export const LocationController = {
  /**
   * Extracts the IP from the request and cleans it.
   * @param req Contains the socket information.
   * @param res Returns JSON data or error messages.
   * @returns A JSON containing th elocation of the user or a 404 status.
   */
  async handle(req: Request, res: Response) {
    const safeIp = resolveRequestIp(req);
    const repository = IpApiService;
    const location = await GetLocationByIp(safeIp, repository);

    // returns a 404 error if the service dails to resolve the IP
    if (location == undefined) {
      return res
        .status(404)
        .json({ message: 'No se pudo determinar su localizacion :(' });
    }

    return res.json(location);
  },
};
