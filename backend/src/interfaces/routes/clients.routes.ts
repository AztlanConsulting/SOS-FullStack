import express from 'express';
import clientsController from '../controllers/clients.controller';
import { upload } from '@interfaces/middleware/upload.middleware';

const router = express.Router();

router.post('/publish', clientsController.publishPet);

router.post(
  '/lost-pet',
  upload.array('images', 5),
  clientsController.createLostPetReportController,
);

export default router;
