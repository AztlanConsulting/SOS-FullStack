import { getWorkshops } from '@interfaces/controllers/workshops.controller';
import express from 'express';
const router = express.Router();

router.get('/', getWorkshops);

export default router;
