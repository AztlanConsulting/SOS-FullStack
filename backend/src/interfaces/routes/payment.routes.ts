import { Router } from 'express';
import { makeCreatePaymentIntent } from '../controllers/payment.controller';
import { processPaymentUseCase } from '../../infrastructure/config/payment.dependency';

const router = Router();

// We pass the initialized Use Case from our dependencies container
router.post('/payment-intent', makeCreatePaymentIntent(processPaymentUseCase));

export default router;
