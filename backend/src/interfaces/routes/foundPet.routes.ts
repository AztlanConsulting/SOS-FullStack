import { postFoundPetReport } from '@interfaces/controllers/foundPetReport.controller';
import express from 'express';

const router = express.Router();

router.post('/report', postFoundPetReport);

export default router;
