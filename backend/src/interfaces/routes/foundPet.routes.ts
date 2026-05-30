import { postFoundPetReport } from '@interfaces/controllers/foundPetReport.controller';
import express from 'express';
import getFoundPetDetails from '../controllers/getFoundPetDetails.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.post('/report', upload.single('image'), postFoundPetReport);
router.get('/:id', getFoundPetDetails);

export default router;
