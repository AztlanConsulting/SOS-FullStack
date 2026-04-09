import type { PaymentApi, PaymentOrderId } from '@domain/ports/paypal.port';

export default async function createOrder(paymentApi: PaymentApi) {
  const { orderId, error }: PaymentOrderId = await paymentApi.createOrder();
  if (error) return null;
  return orderId;
}
