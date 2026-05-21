import { Router } from 'express';
import { getManuals } from '../controllers/manual.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/getManuals', authMiddleware, getManuals);
export default router;
