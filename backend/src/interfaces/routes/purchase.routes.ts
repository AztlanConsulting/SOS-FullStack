import { Router } from 'express';
import { makeCreatePurchase } from '../controllers/purchase.controller';

const router = Router();

router.post('/createPurchase', makeCreatePurchase());

export default router;
