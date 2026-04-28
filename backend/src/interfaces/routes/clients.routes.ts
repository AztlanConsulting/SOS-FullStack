import express from 'express';
import multer from 'multer';
import clientsController from '../controllers/clients.controller';
import { upload } from '@interfaces/middleware/upload.middleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/publish', clientsController.publishPet);

router.post(
  '/lost-pet',
  upload.array('images', 4),
  clientsController.createLostPetReportController,
);

export default router;
