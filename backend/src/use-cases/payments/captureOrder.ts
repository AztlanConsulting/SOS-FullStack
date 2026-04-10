import type { PaymentApi } from '@domain/ports/paypal.port';

export default async function captureOrder(
  paymentApi: PaymentApi,
  orderId: string,
) {
  const response = await paymentApi.completeOrder(orderId);

  return response;
}
