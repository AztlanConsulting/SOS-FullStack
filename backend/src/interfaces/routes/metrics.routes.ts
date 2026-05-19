import express from 'express';
import { MetricsController } from '../controllers/metrics.controller';

const router = express.Router();

/**
 * @route   GET /metrics/plan-distribution
 * @desc    Retrieves proportional breakdown metrics across currently active tier subscriptions.
 * @access  Protected / Administrator
 */
router.get('/plan-distribution', MetricsController.getPlanDistributionUseCase);
/**
 * @route   GET /metrics/clients-by-country
 * @desc    Retrieves volume distribution data aggregates sorted geographically by country.
 * @access  Protected / Administrator
 */
router.get('/clients-by-country', MetricsController.getClientsByCountry);
/**
 * @route   GET /metrics/visits
 * @desc    Retrieves telemetry logging data on tracking access points and user visit velocity.
 * @access  Protected / Administrator
 */
router.get('/visits', MetricsController.getVisitMetric);
export default router;
