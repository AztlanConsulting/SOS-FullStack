import { Router } from 'express';
import {
  getResources,
  deleteResourceById,
} from '../controllers/resource.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getResources);
router.delete('/:id', authMiddleware, deleteResourceById);

export default router;
