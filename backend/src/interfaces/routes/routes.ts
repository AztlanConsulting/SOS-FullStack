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

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/clients', clientsRoutes);
router.use('/images', imageRoutes);
router.use('/payments', paymentRoutes);
router.use('/workshop', workshopRoutes);
router.use('/manuals', manualRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/plans', planRoutes);

//Route for the Ip based geolocation.
router.get('/ip', LocationController.handle);

export default router;
