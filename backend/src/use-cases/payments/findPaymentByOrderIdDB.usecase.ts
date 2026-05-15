import type { PaymentRepository } from '@domain/repositories/payment.repository';

export const findPaymentByOrderIdDB = async (
  paymentRepository: PaymentRepository,
  orderId: string,
): Promise<boolean> => {
  return await paymentRepository.findPaymentByOrderId(orderId);
};
