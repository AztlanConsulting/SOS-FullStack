import { Router } from 'express';
import { getManuals } from '../controllers/manual.controller';

const router = Router();

router.get('/getManuals', getManuals);
export default router;
