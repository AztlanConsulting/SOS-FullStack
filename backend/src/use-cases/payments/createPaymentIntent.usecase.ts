import type {
  PaymentIntentResult,
  PaymentProvider,
  PaymentIntentDTO,
} from '@domain/ports/paymentProvider.port';

export const createPaymentIntent = async (
  paymentProvider: PaymentProvider,
  data: PaymentIntentDTO,
): Promise<PaymentIntentResult> => {
  return await paymentProvider.createIntent(data);
};
