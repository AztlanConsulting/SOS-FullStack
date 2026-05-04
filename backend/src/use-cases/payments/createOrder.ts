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
  if (data.amount < 0) throw Error("Amount can't be a negative number");
  return await paymentProvider.createOrder(data, orderCreator(data));
};
