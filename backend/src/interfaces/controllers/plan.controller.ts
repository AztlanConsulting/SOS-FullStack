import type { Request, Response } from 'express';
import { getPlansDB } from '@use-cases/plans/getPlansDB.usecase';
import { PlanDataAccess } from '../data-access/plan.data-access';

export const makeGetPlans = () => {
  return async (req: Request, res: Response) => {
    try {
      const repository = getPlansDB(PlanDataAccess);
      const plans = await repository.getPlans();
      res.json(plans);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Failed to fetch plans';
      res.status(500).json({ error: message });
    }
  };
};
