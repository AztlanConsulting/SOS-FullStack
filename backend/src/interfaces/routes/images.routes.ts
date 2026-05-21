import findSimilarPets from '@interfaces/controllers/findSimilarPets.controller';
import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
import countPetPages from '@interfaces/controllers/countPetPages.controller';
import { fileFilter } from '../middleware/upload.middleware';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 5MB per file
  },
  fileFilter,
});

router.post(
  '/findSimilarPets',
  authMiddleware,
  upload.single('image'),
  findSimilarPets,
);
router.post(
  '/countPets',
  authMiddleware,
  upload.single('image'),
  countPetPages,
);

export default router;
