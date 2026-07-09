import type { Request, Response } from 'express';
import { activatePlan } from '@/use-cases/plans/activatePlan.usecase';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';

export const retryPlanActivation = async (req: Request, res: Response) => {
  try {
    const { userEmail, planId } = req.body;

    if (!userEmail || !planId) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    await activatePlan(
      userDataAccess,
      purchasedPlanDataAccess,
      userEmail,
      planId,
    );

    return res.status(200).json({
      message: 'Plan activation queued successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'PLAN_NOT_FOUND') {
      return res.status(404).json({
        message: 'Purchased plan not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
