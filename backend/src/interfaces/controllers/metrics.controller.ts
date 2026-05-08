import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';
import { getVisitMetric } from '@/use-cases/clients/getVisitMetrics.usecase';
import { getPlanDistributionUseCase } from '@/use-cases/plans/getPlanDistribution.usecase';
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
};
