import express from 'express';
import { IpApiService } from 'src/infrastructure/api/IpApiService';
import { GetLocationByIp } from 'src/use-cases/ip/GetLocationByIp';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.get('/ip', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.toString() ||
    req.socket.remoteAddress ||
    '8.8.8.8';

  const repository = new IpApiService();
  const location = await GetLocationByIp(ip, repository);

  if (!location) {
    return res
      .status(404)
      .json({ message: 'No se pudo determinar tu localización :(' });
  }

  return res.status(200).json({
    status: 'ok',
    message: `You are in: ${location.country}, and your currency is ${location.currency}`,
  });
});

export default router;
