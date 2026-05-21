import {
  getWorkshops,
  postWorkshop,
} from '@interfaces/controllers/workshops.controller';
import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getWorkshops);
router.post('/', authMiddleware, upload.single('image'), postWorkshop);

export default router;
