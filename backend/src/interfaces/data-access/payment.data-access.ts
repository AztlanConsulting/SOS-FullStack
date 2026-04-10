import type { PaymentRepository } from '@domain/repositories/payment.repository';
import type { PaymentDBDto } from '@domain/repositories/payment.repository';
import { PaymentModel } from '@domain/models/payment.model';

export const PaymentDataAccess: PaymentRepository = {
  async createPending(data: PaymentDBDto): Promise<void> {
    await PaymentModel.create({
      ...data,
      status: 'pending',
    });
  },
  async markAsSucceeded(stripeId: string): Promise<string> {
    const result = await PaymentModel.updateOne(
      { stripeId },
      { status: 'succeeded' },
    );

    if (result.matchedCount === 0) return 'not_found';
    if (result.modifiedCount === 0) return 'already_updated';
    return 'updated';
  },
};
