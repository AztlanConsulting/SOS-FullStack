import type { Request, Response } from 'express';
import { paymentDetails } from '@/types/payment.types';
import { createPaymentIntent } from '@/use-cases/payments/createPaymentIntent.usecase';
import { StripeProvider } from '@/infrastructure/api/stripeProvider.api';
import type { PaymentProvider } from '@/domain/ports/paymentProvider.port';
import PaypalProvider from '@/infrastructure/api/paypal.api';
import { createPendingIntentDB } from '@/use-cases/payments/createPendingIntentDB.usecase';
import { PaymentDataAccess } from '../data-access/payment.data-access';

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

    if (paymentDetail.error) throw paymentDetail.error;

    const paymentProvider: PaymentProvider = getPaymentProvider(
      paymentDetail.data.method ?? '',
    );

    const result = await createPaymentIntent(
      paymentProvider,
      paymentDetail.data,
    );

    await createPendingIntentDB(PaymentDataAccess, {
      orderId: result.id,
      amount: result.amount,
      currency: result.currency,
      clientSecret: result.clientSecret!,
    });

    return res.status(201).json({
      message: 'Payment intent created successfully',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment failed';
    return res.status(500).json({ error: message });
  }
}

/**
 * Determine the provider implemantation that needs to be used
 * @returns PaymentProvider
 */
function getPaymentProvider(paymentMethod: string): PaymentProvider {
  if (paymentMethod == 'paypal') {
    return PaypalProvider;
  }
  return StripeProvider;
}
