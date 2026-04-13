import express from 'express';
import { LocationController } from '../controllers/LocationController';
import imageRoutes from './images.routes';
import clientsRoutes from './clients.routes';
import paymentRoutes from './payment.routes';
import workshopRoutes from './workshops.routes';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/clients', clientsRoutes);
router.use('/images', imageRoutes);
router.use('/payments', paymentRoutes);
router.use('/workshop', workshopRoutes);

//Route for the Ip based geolocation.
router.get('/ip', LocationController.handle);

export default router;
