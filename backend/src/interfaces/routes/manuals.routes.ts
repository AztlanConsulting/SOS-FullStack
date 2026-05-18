import { Router } from 'express';
import { getManuals, getManualById } from '../controllers/manual.controller';

const router = Router();

router.get('/getManuals', getManuals);
router.get('/:id', getManualById);

export default router;
