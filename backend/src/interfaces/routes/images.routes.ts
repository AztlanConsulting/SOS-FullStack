import findSimilarPets from '@interfaces/controllers/findSimilarPets.controller';
import foundPet from '@interfaces/controllers/foundPet.controller';
import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/foundPet', upload.single('image'), foundPet);
router.post(
  '/findSimilarPets',
  authMiddleware,
  upload.single('image'),
  findSimilarPets,
);

export default router;
