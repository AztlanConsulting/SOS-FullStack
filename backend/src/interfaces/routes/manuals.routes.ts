import { Router } from 'express';
import { makeGetManuals } from '../controllers/manual.controller';

const router = Router();

router.get('/getManuals', makeGetManuals());

export default router;
