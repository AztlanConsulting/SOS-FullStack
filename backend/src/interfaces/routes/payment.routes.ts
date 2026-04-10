import { Router } from 'express';
import {
  makeCreatePaymentIntent,
  makehandleStripeWebhook,
} from '../controllers/payment.controller';

const router = Router();

router.post('/payment-intent', makeCreatePaymentIntent());
router.post('/webhook', makehandleStripeWebhook);

export default router;
