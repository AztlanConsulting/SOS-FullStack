import type { Request, Response } from 'express';
import logger from '@/utils/logger';
import { paymentDetails } from '@/types/payment.types';
import { createOrder as usCreateOrder } from '@/use-cases/payments/createOrder';
import PaypalProvider from '@/infrastructure/api/paypal.api';
import { createPendingIntentDB } from '@/use-cases/payments/createPendingIntentDB.usecase';
import { PaymentDataAccess } from '@infrastructure/data-access/payment.data-access';

/**
 * Controller that receives payment and order detauls to build the transaction
 * @params paymentDetail:
 * @amount number
 * @currency string - MXN, USD, etc
 * @method- paypal | auto | spei...
 * @customerId string ObjectId
 * @product - productId & productName
 */
export default async function createOrder(req: Request, res: Response) {
  try {
    const paymentDetail = paymentDetails.safeParse(req.body);
    if (paymentDetail.error) {
      logger.error('createOrder validation failed', {
        error: paymentDetail.error,
        body: req.body,
      });
      throw paymentDetail.error;
    }

    const result = await usCreateOrder(PaypalProvider, paymentDetail.data);

    await createPendingIntentDB(PaymentDataAccess, {
      orderId: result.id,
      amount: result.amount,
      currency: result.currency,
      method: paymentDetail.data.method ?? 'unknown',
      clientSecret: result.clientSecret ?? null,
    });

    return res.status(201).json({
      message: 'Payment intent created successfully',
      result,
    });
  } catch (error) {
    logger.error('createOrder error', {
      error,
      body: req.body,
    });
    const message = error instanceof Error ? error.message : 'Payment failed';
    return res.status(500).json({ error: message });
  }
}
