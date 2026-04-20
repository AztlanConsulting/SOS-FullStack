import type { PaymentRepository } from '@domain/repositories/payment.repository';
import type { PaymentDBDto } from '@domain/repositories/payment.repository';
import { PaymentModel } from '@domain/models/payment.model';

export const PaymentDataAccess: PaymentRepository = {
  /**
   * Create a pending payment record in the database.
   * @param data - Payment data including Stripe ID, amount, and currency
   */
  async createPending(data: PaymentDBDto): Promise<void> {
    await PaymentModel.create({
      ...data,
      status: 'pending',
    });
  },
  /**
   * Mark a payment as succeeded by updating its status in the database.
   * @param stripeId - The Stripe payment intent ID
   * @returns Status string: 'updated', 'already_updated', or 'not_found'
   */
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
