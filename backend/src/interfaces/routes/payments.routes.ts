import { Router } from 'express';
import {
  makeCreatePaymentIntent,
  makehandleStripeWebhook,
} from '../controllers/payment.controller';
import captureOrder from '@interfaces/controllers/captureOrder.controller';
import createOrder from '@interfaces/controllers/createOrder.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/payment-intent', makeCreatePaymentIntent);
router.post('/webhook', makehandleStripeWebhook);
router.post('/create-order', upload.array('images', 4), createOrder);
router.post('/capture-order/:orderId', captureOrder);

export default router;
