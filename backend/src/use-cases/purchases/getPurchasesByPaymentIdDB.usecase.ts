import type { PurchaseDTO } from '@domain/repositories/purchase.repository';
import type { PurchaseRepository } from '@domain/repositories/purchase.repository';

export const getPurchasesByPaymentIdDB = async (
  purchaseRepository: PurchaseRepository,
  paymentId: string,
): Promise<PurchaseDTO[]> => {
  return purchaseRepository.getPurchasesByPaymentId(paymentId);
};
