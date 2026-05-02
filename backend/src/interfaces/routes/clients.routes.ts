import express from 'express';
import clientsController from '../controllers/clients.controller';
import { upload } from '@interfaces/middleware/upload.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/publish', clientsController.publishPet);

router.post(
  '/lost-pet',
  upload.array('images', 4),
  clientsController.createLostPetReportController,
);

router.get(
  '/plan-progress',
  authMiddleware,
  clientsController.getPlanProgressController,
);

export default router;
