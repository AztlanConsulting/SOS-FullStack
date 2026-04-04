import express from 'express';
import { LocationController } from '../controllers/LocationController';
import clientsRoutes from './clients.routes';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

//Route for the Ip based geolocation.
router.get('/ip', LocationController.handle);
router.use('/clients', clientsRoutes);

export default router;
