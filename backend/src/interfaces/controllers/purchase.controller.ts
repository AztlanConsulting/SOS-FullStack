import type { Request, Response } from 'express';
import { createPurchaseDB } from '@use-cases/purchases/createPurchaseDB.usecase';

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

      await createPurchaseDB({
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
