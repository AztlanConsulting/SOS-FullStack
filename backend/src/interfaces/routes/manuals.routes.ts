import { Router } from 'express';
import {
  getManuals,
  getManualById,
  deleteManualById,
} from '../controllers/manual.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/getManuals', getManuals);
router.get('/:id', getManualById);
router.delete('/:id', authMiddleware, deleteManualById);

export default router;
