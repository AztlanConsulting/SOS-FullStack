import express from 'express';
import createSearchFormController from '../controllers/createSearchForm.contoller';
import getSearchFormsController from '../controllers/getSearchForms.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, createSearchFormController);
router.get('/', authMiddleware, getSearchFormsController);

export default router;
