import express from 'express';
import { MetricsController } from '../controllers/metrics.controller';

const router = express.Router();

router.get('/plan-distribution', MetricsController.getPlanDistributionUseCase);

router.get('/visits', MetricsController.getVisitMetric);
export default router;
