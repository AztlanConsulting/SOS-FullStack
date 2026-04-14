import { Router } from 'express';
import { makeGetPlans } from '@interfaces/controllers/plan.controller';

const router = Router();

router.get('/getPlans', makeGetPlans());

export default router;
