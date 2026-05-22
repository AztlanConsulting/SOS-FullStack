import express from 'express';
import createSearchFormController from '../controllers/createSearchForm.contoller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, createSearchFormController);

export default router;
