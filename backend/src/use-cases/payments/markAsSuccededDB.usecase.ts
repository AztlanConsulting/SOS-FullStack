import type { PaymentRepository } from '@domain/repositories/payment.repository';

export const markAsSucceededDB = async (
  paymentRepository: PaymentRepository,
  orderId: string,
): Promise<string> => {
  return await paymentRepository.markAsSucceeded(orderId);
};
