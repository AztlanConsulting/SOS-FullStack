import type { Request, Response } from 'express';
import { createPurchaseDB } from '@use-cases/purchases/createPurchaseDB.usecase';
import { PurchaseDataAccess } from '@infrastructure/data-access/purchase.data-access';

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
        return res.status(400).json({ error: 'Missing required fields' });
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
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Purchase failed';
      return res.status(500).json({ error: message });
    }
  };
};
