import express from 'express';
import imageRouter from './images.routes';
import clientsRoutes from './clients.routes';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/images', imageRouter);
router.use('/clients', clientsRoutes);

export default router;
