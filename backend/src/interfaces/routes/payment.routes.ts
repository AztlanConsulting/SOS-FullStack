import { Router } from 'express';
import {
  makeCreatePaymentIntent,
  makeHandleStripeWebhook,
} from '../controllers/payment.controller';
import { processPaymentUseCase } from '../../infrastructure/config/payment.dependency';
import { stripeProvider } from '../../infrastructure/config/stripe.dependency';

const router = Router();

// We pass the initialized Use Case from our dependencies container
router.post('/payment-intent', makeCreatePaymentIntent(processPaymentUseCase));
router.post('/webhook', makeHandleStripeWebhook(stripeProvider));

export default router;
