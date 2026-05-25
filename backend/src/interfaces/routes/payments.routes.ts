import { Router } from 'express';
import {
  makeCreatePaymentIntent,
  makehandleStripeWebhook,
} from '../controllers/payment.controller';
import captureOrder from '@interfaces/controllers/captureOrder.controller';
import createOrder from '@interfaces/controllers/createOrder.controller';
import confirmPaymentAmount from '../middleware/confirmPaymentAmount.middleware';

const router = Router();

router.post('/payment-intent', confirmPaymentAmount, makeCreatePaymentIntent);
router.post('/webhook', makehandleStripeWebhook);
router.post('/create-order', confirmPaymentAmount, createOrder);
router.post('/capture-order/:orderId', captureOrder);

export default router;
