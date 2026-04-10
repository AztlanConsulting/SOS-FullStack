import { PaymentDataAccess } from '../../interfaces/data-access/payment.data-access';

export const markAsSucceededDB = async (stripeId: string): Promise<string> => {
  return await PaymentDataAccess.markAsSucceeded(stripeId);
};
