import { Router } from 'express';
import {
  makeCreatePaymentIntent,
  makehandleStripeWebhook,
} from '../controllers/payment.controller';
import captureOrder from '@interfaces/controllers/captureOrder.controller';
import createOrder from '@interfaces/controllers/createOrder.controller';

const router = Router();

router.post('/payment-intent', createOrder);
router.post('/webhook', makehandleStripeWebhook);
// router.post('/create-order', createOrder);
router.get('/capture-order/:orderId', captureOrder);

export default router;
