import type { PurchaseDTO } from '@domain/repositories/purchase.repository';
import { PurchaseDataAccess } from '@interfaces/data-access/purchase.data-access';

export const createPurchaseDB = async (data: PurchaseDTO): Promise<void> => {
  await PurchaseDataAccess.createPurchase(data);
};
