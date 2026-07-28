import type { Request, Response } from 'express';
import logger from '@/utils/logger';
import { createPurchaseDB } from '@use-cases/purchases/createPurchaseDB.usecase';
import { PurchaseDataAccess } from '@infrastructure/data-access/purchase.data-access';
import { activatePlan } from '@/use-cases/plans/activatePlan.usecase';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';

/**
 * Factory function that returns a middleware to create a new purchase.
 * @returns Express middleware handler that creates a purchase with user email, payment ID, product ID, and product type
 */
export const makeCreatePurchase = () => {
  return async (req: Request, res: Response) => {
    try {
      const { userEmail, paymentId, productId, productType } = req.body as {
        userEmail?: string;
        paymentId?: string;
        productId?: string;
        productType?: string;
      };

      if (
        userEmail === undefined ||
        paymentId === undefined ||
        productId === undefined ||
        productType === undefined
      ) {
        logger.warn('makeCreatePurchase missing required fields', {
          body: req.body,
        });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (productType === 'plan' || productType === 'plan-extension') {
        await activatePlan(
          userDataAccess,
          purchasedPlanDataAccess,
          userEmail,
          productId,
        );
      }

      await createPurchaseDB(PurchaseDataAccess, {
        userEmail,
        paymentId,
        productId,
        productType,
      });

      return res.status(201).json({
        message: 'Purchase created successfully',
      });
    } catch (error) {
      logger.error('makeCreatePurchase error', {
        error,
        body: req.body,
      });
      const message =
        error instanceof Error ? error.message : 'Purchase failed';
      return res.status(500).json({ error: message });
    }
  };
};
