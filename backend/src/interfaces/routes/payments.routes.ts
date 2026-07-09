import { Router } from 'express';
import {
  makeCreatePaymentIntent,
  makehandleStripeWebhook,
} from '../controllers/payment.controller';
import captureOrder from '@interfaces/controllers/captureOrder.controller';
import createOrder from '@interfaces/controllers/createOrder.controller';
import { retryPlanActivation } from '@interfaces/controllers/retryPlanActivation.controller';
import confirmPaymentAmount from '../middleware/confirmPaymentAmount.middleware';
import confirmPaymentLocalizedAmount from '../middleware/confirmPaymentLocalizedAmount.middleware';

const router = Router();

router.post(
  '/payment-intent',
  confirmPaymentLocalizedAmount,
  // confirmPaymentAmount,
  makeCreatePaymentIntent,
);
router.post('/webhook', makehandleStripeWebhook);
router.post('/create-order', confirmPaymentAmount, createOrder);
router.post('/capture-order/:orderId', captureOrder);
router.post('/retry-plan-activation', retryPlanActivation);

export default router;
