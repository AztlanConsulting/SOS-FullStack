import type {
  PaymentIntentResult,
  PaymentProvider,
  PaymentIntentDTO,
} from '@domain/ports/paymentProvider.port';

export const createPaymentIntent = async (
  paymentProvider: PaymentProvider,
  data: PaymentIntentDTO,
): Promise<PaymentIntentResult> => {
  console.log(data);
  return await paymentProvider.createIntent(data);
};
