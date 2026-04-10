import type { PaymentDBDto } from '@domain/repositories/payment.repository';
import { PaymentDataAccess } from '../../interfaces/data-access/payment.data-access';

export const createPendingIntentDB = async (
  data: PaymentDBDto,
): Promise<void> => {
  return await PaymentDataAccess.createPending(data);
};
