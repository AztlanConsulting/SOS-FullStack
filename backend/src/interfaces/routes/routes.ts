import express from 'express';
import clientsRoutes from './clients.routes';
import paymentRoutes from './payment.routes';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/clients', clientsRoutes);

router.use('/payments', paymentRoutes);

export default router;
