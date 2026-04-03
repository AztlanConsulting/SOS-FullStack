import type { Request, Response } from 'express';
import { IpApiService } from 'src/infrastructure/api/IpApiService';
import { GetLocationByIp } from 'src/use-cases/ip/GetLocationByIp';

export const LocationController = {
  async handle(req: Request, res: Response) {
    const ip =
      req.headers['x-forwarded-for']?.toString() ||
      req.socket.remoteAddress ||
      '8.8.8.8';

    const repository = new IpApiService();
    const loaction = await GetLocationByIp(ip, repository);

    if (!location) {
      return res
        .status(404)
        .json({ message: 'No se pudo determinar su localizacion :(' });
    }

    return res.json(location);
  },
};
