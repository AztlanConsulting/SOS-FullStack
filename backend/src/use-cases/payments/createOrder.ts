import type {
  PaymentIntentDTO,
  PaymentIntentResult,
} from '@/domain/ports/paymentProvider.port';
import type { PaypalApi } from '@/domain/ports/paypal.port';
import orderCreator from './orderCreator';

export const createOrder = async (
  paymentProvider: PaypalApi,
  data: PaymentIntentDTO,
): Promise<PaymentIntentResult> => {
  return await paymentProvider.createOrder(data, orderCreator(data));
};
