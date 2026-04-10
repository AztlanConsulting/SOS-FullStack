import type { PaymentIntentResult } from '../../domain/ports/paymentProvider.port';
import { StripeProvider } from '../../infrastructure/api/stripeProvider.api';
import type { PaymentIntentDTO } from '../../domain/ports/paymentProvider.port';

export const createPaymentIntent = async (
  data: PaymentIntentDTO,
): Promise<PaymentIntentResult> => {
  return await StripeProvider.createIntent({
    amount: data.amount,
    currency: data.currency,
  });
};
