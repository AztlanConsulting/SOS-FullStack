import { Router } from 'express';
import {
  makeCreatePaymentIntent,
  makehandleStripeWebhook,
} from '../controllers/payment.controller';
import captureOrder from '@interfaces/controllers/captureOrder.controller';
import createOrder from '@interfaces/controllers/createOrder.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/payment-intent', authMiddleware, makeCreatePaymentIntent);
router.post('/webhook', makehandleStripeWebhook);
router.post('/create-order', authMiddleware, createOrder);
router.post('/capture-order/:orderId', authMiddleware, captureOrder);

export default router;
