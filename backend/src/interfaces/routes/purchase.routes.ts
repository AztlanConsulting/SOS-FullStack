import { Router } from 'express';
import { makeCreatePurchase } from '../controllers/purchase.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/createPurchase', authMiddleware, makeCreatePurchase());

export default router;
