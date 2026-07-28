import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { getClientsByCountry } from '@/use-cases/clients/getClientsByCountry.usecase';
import { getVisitMetric } from '@/use-cases/clients/getVisitMetrics.usecase';
import { getPlanDistributionUseCase } from '@/use-cases/plans/getPlanDistribution.usecase';
import logger from '@/utils/logger';
import type { Request, Response } from 'express';

/**
 * Dependencies injected into the use cases.
 * Following the Clean Architecture pattern, we pass the repository
 * implementation to the use case functions.
 */
const deps = { purchasedPlanRepository: purchasedPlanDataAccess };

/**
 * MetricsController
 *
 * Handles incoming HTTP requests related to dashboard analytics and business metrics.
 * Acts as the entry point that parses request parameters and invokes the
 */
export const MetricsController = {
  /**
   * GET /metrics/plan-distribution
   * Retrieves data on how many times each type of plan has been purchased.
   */
  getPlanDistributionUseCase: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const distribution = await getPlanDistributionUseCase(deps);
      res.status(200).json(distribution);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plan distribution' });
    }
  },
  /**
   * GET /metrics/visits?year=2024&month=5
   * Retrieves weekly traffic and engagement metrics for a specific time period.
   *
   * Query Params:
   * @param year - Optional. Defaults to current year.
   * @param month - Optional. Defaults to current month (1-12).
   */
  getVisitMetric: async (req: Request, res: Response): Promise<void> => {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();
      const month = Number(req.query.month) || new Date().getMonth() + 1;
      const visits = await getVisitMetric(year, month);
      res.status(200).json(visits);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch visit metrics' });
    }
  },

  /**
   * HTTP Request Handler to retrieve administrative metrics of active user accounts
   * aggregated geographically by country origins.
   * * Maps incoming HTTP requests directly to internal Clean Architecture use cases
   * using explicit repository injections.
   * * @route GET /api/analytics/clients-by-country
   * @param req - Express incoming HTTP request context structure.
   * @param res - Express outgoing HTTP response channel context object.
   * @returns {Promise<void>} Sends a JSON payload array containing names and total counts.
   */
  getClientsByCountry: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await getClientsByCountry({
        userRepository: userDataAccess,
      });
      res.status(200).json(data);
    } catch (error) {
      logger.error('getClientsByCountry error', { error });
      res.status(500).json({ error: 'Failed to fetch clients by country' });
    }
  },
};
