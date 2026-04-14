import type { PurchaseRepository } from '@domain/repositories/purchase.repository';
import type { PurchaseDTO } from '@domain/repositories/purchase.repository';
import { PurchaseModel } from '@domain/models/purchase.model';

export const PurchaseDataAccess: PurchaseRepository = {
  /**
   * Create a new purchase record in the database.
   * @param data - Purchase data including user email, payment ID, product ID, and product type
   */
  async createPurchase(data: PurchaseDTO): Promise<void> {
    await PurchaseModel.create({
      ...data,
    });
  },
};
