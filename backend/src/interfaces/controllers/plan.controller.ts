import type { Request, Response } from 'express';
import { getPlansDB } from '@use-cases/plans/getPlansDB.usecase';
import { PlanDataAccess } from '../data-access/plan.data-access';

/**
 * Factory function that creates the Express controller for fetching plans.
 * Orchestrates the dependency injection by passing the data access layer to the use case.
 * @returns An async Express middleware function to handle the request.
 */
export const makeGetPlans = () => {
  return async (req: Request, res: Response) => {
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
};
