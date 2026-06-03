import {
  getWorkshops,
  postWorkshop,
  deleteWorkshopById,
} from '@interfaces/controllers/workshops.controller';
import express from 'express';
import multer from 'multer';
import { fileFilter } from '../middleware/upload.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
  },
  fileFilter,
});

router.get('/', getWorkshops);
router.post('/', authMiddleware, upload.single('image'), postWorkshop);
router.delete('/:id', authMiddleware, deleteWorkshopById);

export default router;
