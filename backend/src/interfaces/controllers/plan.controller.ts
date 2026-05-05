import type { Request, Response } from 'express';
import { getPlansDB } from '@use-cases/plans/getPlansDB.usecase';
import { PlanDataAccess } from '@infrastructure/data-access/plan.data-access';

/**
 * Express controller that handles fetching plans.
 * Calls the use case and returns the result as JSON.
 */
export const getPlans = async (_req: Request, res: Response): Promise<void> => {
  try {
    /**
     * Initialize the use case with the concrete data access implementation.
     */
    const repository = getPlansDB(PlanDataAccess);
    const plans = await repository.getPlans();
    res.json(plans);
  } catch (error) {
    console.error(error);
    /**
     * Standardized error response.
     * Extracts the error message if it's a known Error object, otherwise defaults to a generic message.
     */
    const message =
      error instanceof Error ? error.message : 'Failed to fetch plans';
    res.status(500).json({ error: message });
  }
};
