import express from 'express';
import { LocationController } from '../controllers/LocationController';
import authRoutes from './auth.routes';
import blogRoutes from './blog.routes';
import imageRoutes from './images.routes';
import clientsRoutes from './clients.routes';
import paymentRoutes from './payments.routes';
import manualRoutes from './manuals.routes';
import purchaseRoutes from './purchase.routes';
import workshopRoutes from './workshops.routes';
import planRoutes from './plans.routes';
<<<<<<< HEAD
import clientRoutes from './client.routes';
import metricsRoutes from './metrics.routes';
=======
import foundPetRoutes from './foundPet.routes';
import pricingRoutes from './pricing.routes';
>>>>>>> f8193bbcb3386dcd51f79fd079f7ed6a5b68e0d7

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/auth', authRoutes);
router.use('/blog', blogRoutes);
router.use('/clients', clientsRoutes);
router.use('/images', imageRoutes);
router.use('/payments', paymentRoutes);
router.use('/workshop', workshopRoutes);
router.use('/manuals', manualRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/plans', planRoutes);
<<<<<<< HEAD
router.use('/api/clients', clientRoutes);
=======
router.use('/found-pets', foundPetRoutes);
router.use('/', pricingRoutes);

>>>>>>> f8193bbcb3386dcd51f79fd079f7ed6a5b68e0d7
//Route for the Ip based geolocation.
router.get('/ip', LocationController.handle);
router.use('/metrics', metricsRoutes);

export default router;
