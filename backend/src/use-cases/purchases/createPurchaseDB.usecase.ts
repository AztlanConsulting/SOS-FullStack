import type { PurchaseDTO } from '@domain/repositories/purchase.repository';
import type { PurchaseRepository } from '@domain/repositories/purchase.repository';

export const createPurchaseDB = async (
  purchaseRepository: PurchaseRepository,
  data: PurchaseDTO,
): Promise<void> => {
  await purchaseRepository.createPurchase(data);
};
