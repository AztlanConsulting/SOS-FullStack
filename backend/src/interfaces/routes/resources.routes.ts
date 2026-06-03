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
import { upload } from '../middleware/upload.middleware';
import uploadResourceImage from '../controllers/uploadResourceImage.controller';

const router = Router();

router.get('/', authMiddleware, getResources);
router.put('/', authMiddleware, updateResource);
router.delete(
  '/:id',
  authMiddleware,
  requirePermission('resources', 'delete'),
  deleteResourceById,
);

router.post(
  '/image',
  authMiddleware,
  upload.single('image'),
  uploadResourceImage,
);

export default router;
