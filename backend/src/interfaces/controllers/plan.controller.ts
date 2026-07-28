import type { Request, Response } from 'express';
import logger from '@/utils/logger';
import { getPlansDB } from '@use-cases/plans/getPlansDB.usecase';
import { PlanDataAccess } from '../../infrastructure/data-access/plan.data-access';
import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';
import { Types } from 'mongoose';

/**
 * Express controller that handles fetching plans.
 * Calls the use case and returns the result as JSON.
 */
export const getPlans = async (_req: Request, res: Response): Promise<void> => {
  try {
    /**
     * Initialize the use case with the concrete data access implementation.
     */
    if (
      process.env.FORCE_GETPLANS_ERROR === '1' ||
      (_req.query as any)?.__testError === '1'
    ) {
      throw new Error('Forced test error in getPlans');
    }
    const plans = await getPlansDB(PlanDataAccess);
    res.json(plans);
  } catch (error) {
    logger.error('getPlans error', { error });
    /**
     * Standardized error response.
     * Extracts the error message if it's a known Error object, otherwise defaults to a generic message.
     */
    const message =
      error instanceof Error ? error.message : 'Failed to fetch plans';
    res.status(500).json({ error: message });
  }
};

export const createPurchasedPlan = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { petId, name, price, duration, radius, features } = req.body as {
      petId?: string;
      name?: string;
      price?: number;
      duration?: number;
      radius?: number;
      features?: string[];
    };

    if (
      !petId ||
      !name ||
      price === undefined ||
      duration === undefined ||
      radius === undefined ||
      !features
    ) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!Types.ObjectId.isValid(petId)) {
      res.status(400).json({ error: 'Invalid petId' });
      return;
    }

    const plan = await purchasedPlanDataAccess.createPurchasedPlan({
      petId: new Types.ObjectId(petId),
      name,
      price,
      duration,
      radius,
      features,
      status: 'continua',
    });

    res.status(201).json({ plan });
  } catch (error) {
    logger.error('createPurchasedPlan error', { error });
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to create purchased plan';
    res.status(500).json({ error: message });
  }
};
