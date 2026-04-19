import type {
  PaymentDBDto,
  PaymentRepository,
} from '@domain/repositories/payment.repository';

export const createPendingIntentDB = async (
  paymentRepository: PaymentRepository,
  data: PaymentDBDto,
): Promise<void> => {
  return await paymentRepository.createPending(data);
};
