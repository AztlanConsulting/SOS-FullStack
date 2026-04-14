import type { PurchaseRepository } from '@domain/repositories/purchase.repository';
import type { PurchaseDTO } from '@domain/repositories/purchase.repository';
import { PurchaseModel } from '@domain/models/purchase.model';

export const PurchaseDataAccess: PurchaseRepository = {
  async createPurchase(data: PurchaseDTO): Promise<void> {
    await PurchaseModel.create({
      ...data,
    });
  },
};
