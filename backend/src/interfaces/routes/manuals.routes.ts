import { Router } from 'express';
import {
  makeGetManuals,
  makeGetManualById,
} from '../controllers/manual.controller';

const router = Router();

router.get('/getManuals', makeGetManuals());
router.get('/getManualById/:id', makeGetManualById());

export default router;
