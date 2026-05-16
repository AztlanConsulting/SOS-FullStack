import type { Request, Response } from 'express';
import { IpApiService } from '@infrastructure/api/IpApiService';
import { GetLocationByIp } from '@use-cases/ip/GetLocationByIp';

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
    //Retrieves the remote IP adress, defaulting to a public DNS IP for testing environments.
    const ipV6 =
      (req.headers['x-forwarded-for'] as string) ??
      req.socket.remoteAddress ??
      '8.8.8.8';
    const ip = ipV6.split(',')[0].trim().replace('::ffff:', '');
    const safeIp = ip === '127.0.0.1' || ip === '::1' ? '8.8.8.8' : ip;
    //Initializes the infraestructure service
    const repository = IpApiService;
    // Exectues the domain use case to fetch the location
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
