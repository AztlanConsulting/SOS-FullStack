import type { Request, Response } from 'express';
import type { ProcessPayment } from '../../use-cases/payments/processPayment.usecase';

export const makeCreatePaymentIntent = (processPayment: ProcessPayment) => {
  return async (req: Request, res: Response) => {
    try {
      const { amount, currency } = req.body as {
        amount?: number;
        currency?: string;
      };

      if (amount === undefined || currency === undefined) {
        return res.status(400).json({ error: 'Missing amount or currency' });
      }

      const result = await processPayment.execute(amount, currency);

      res.json(result);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Payment failed';
      res.status(500).json({ error: message });
    }
  };
};
