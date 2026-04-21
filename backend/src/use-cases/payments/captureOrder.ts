import type { PaypalApi } from '@domain/ports/paypal.port';

export default async function captureOrder(
  paymentApi: PaypalApi,
  orderId: string,
) {
  const response = await paymentApi.completeOrder(orderId);

  return response;
}
