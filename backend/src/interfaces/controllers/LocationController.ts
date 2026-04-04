import type { Request, Response } from 'express';
import { IpApiService } from 'src/infrastructure/api/IpApiService';
import { GetLocationByIp } from 'src/use-cases/ip/GetLocationByIp';

export const LocationController = {
  async handle(req: Request, res: Response) {
    const ipV6 = req.socket.remoteAddress || '8.8.8.8';

    const ip = ipV6.replace('::ffff:', '');
    const repository = new IpApiService();
    const location = await GetLocationByIp(ip, repository);

    if (!location) {
      return res
        .status(404)
        .json({ message: 'No se pudo determinar su localizacion :(' });
    }

    return res.json(location);
  },
};
