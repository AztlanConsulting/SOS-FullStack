import { Router } from 'express';
import updateResource from '../controllers/updateResource.controller';
import {
  getResources,
  deleteResourceById,
} from '../controllers/resource.controller';
import {
  authMiddleware,
  requirePermission,
} from '../middleware/auth.middleware';

const router = Router();

router.get('/', getResources);
router.put('/', updateResource);
router.delete(
  '/:id',
  authMiddleware,
  requirePermission('resources', 'delete'),
  deleteResourceById,
);

export default router;
