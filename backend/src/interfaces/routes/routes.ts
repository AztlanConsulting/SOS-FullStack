import express from 'express';
import { LocationController } from '../controllers/LocationController';
import imageRouter from './images.routes';
import clientsRoutes from './clients.routes';
import paymentRoutes from './payments.routes';
import manualRoutes from './manuals.routes';
import purchaseRoutes from './purchase.routes';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/clients', clientsRoutes);
router.use('/images', imageRouter);
router.use('/payments', paymentRoutes);

router.use('/manuals', manualRoutes);

router.use('/purchases', purchaseRoutes);

//Route for the Ip based geolocation.
router.get('/ip', LocationController.handle);

export default router;
