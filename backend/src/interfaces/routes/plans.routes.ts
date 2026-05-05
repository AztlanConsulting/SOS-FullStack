import { Router } from 'express';
import {
  getPlans,
  activatePlanController,
} from '@interfaces/controllers/plan.controller';

const router = Router();

/**
 * Route definitions for Plan-related resources.
 * GET /getPlans
 * Retrieves the list of all available service plans from the database.
 */
router.get('/getPlans', getPlans);

router.post('/activate-plan', activatePlanController);

export default router;
