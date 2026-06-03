import { Router } from 'express';
import {
  getResources,
  deleteResourceById,
} from '../controllers/resource.controller';
import { authMiddleware, requirePermission } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getResources);
router.delete('/:id', authMiddleware, requirePermission('resources', 'delete'), deleteResourceById);

export default router;
