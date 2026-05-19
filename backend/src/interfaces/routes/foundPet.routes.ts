import { postFoundPetReport } from '@interfaces/controllers/foundPetReport.controller';
import express from 'express';
import getFoundPetDetails from '../controllers/getFoundPetDetails.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/report', postFoundPetReport);
router.get('/:id', getFoundPetDetails);

export default router;
