import express from 'express';
import createSearchFormController from '../controllers/createSearchForm.contoller';

const router = express.Router();

router.post('/', createSearchFormController);

export default router;
