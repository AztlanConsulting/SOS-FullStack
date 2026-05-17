import findSimilarPets from '@interfaces/controllers/findSimilarPets.controller';
import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
import countPetPages from '@interfaces/controllers/countPetPages.controller';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/findSimilarPets',
  // authMiddleware,
  upload.single('image'),
  findSimilarPets,
);
router.post(
  '/countPets',
  // authMiddleware,
  upload.single('image'),
  countPetPages,
);

export default router;
