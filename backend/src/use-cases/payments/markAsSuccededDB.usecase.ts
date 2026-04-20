import type { PaymentRepository } from '@domain/repositories/payment.repository';

export const markAsSucceededDB = async (
  paymentRepository: PaymentRepository,
  stripeId: string,
): Promise<string> => {
  return await paymentRepository.markAsSucceeded(stripeId);
};
