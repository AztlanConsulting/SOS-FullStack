import express from 'express';
import { LocationController } from '../controllers/LocationController';
import imageRouter from './images.routes';
import clientsRoutes from './clients.routes';
import planRoutes from './plans.routes';
import paymentRouter from './payment.routes';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/clients', clientsRoutes);
router.use('/images', imageRouter);
router.use('/payments', paymentRouter);

router.use('/plans', planRoutes);

//Route for the Ip based geolocation.
router.get('/ip', LocationController.handle);

export default router;
