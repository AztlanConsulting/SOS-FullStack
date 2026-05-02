import type { PurchaseRepository } from '@domain/repositories/purchase.repository';
import type { ManualRepository } from '@domain/repositories/manual.repository';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';

import type { PurchasedResourceResponse } from '@validation/clients.type';

interface Dependencies {
  purchaseRepository: PurchaseRepository;
  manualRepository: ManualRepository;
  workshopRepository: WorkshopRepository;
}

export const getPurchasedResources = async (
  { purchaseRepository, manualRepository, workshopRepository }: Dependencies,
  userEmail: string,
): Promise<PurchasedResourceResponse[]> => {
  const purchases = await purchaseRepository.getPurchasesByUserEmail(userEmail);

  const enrichmentPromises = purchases.map(async (purchase) => {
    if (purchase.productType === 'manual') {
      const manual = await manualRepository.getManualById(purchase.productId);
      if (!manual) return null;

      return {
        id: purchase.productId,
        name: manual.name,
        type: 'manual' as const,
        imageUrl: manual.imageUrl,
      };
    }

    if (purchase.productType === 'workshop') {
      const workshop = await workshopRepository.getWorkshopById(
        purchase.productId,
      );
      if (!workshop) return null;

      return {
        id: purchase.productId,
        name: workshop.name,
        type: 'workshop' as const,
        imageUrl: workshop.img || '',
        description: workshop.description,
      };
    }

    return null;
  });

  const results = await Promise.all(enrichmentPromises);
  return results.filter(
    (item): item is PurchasedResourceResponse => item !== null,
  );
};
