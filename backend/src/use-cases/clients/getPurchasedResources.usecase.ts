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

  const enrichmentPromises = purchases.map(
    async (purchase): Promise<PurchasedResourceResponse | null> => {
      if (purchase.productType === 'manual') {
        const manual = await manualRepository.getManualById(purchase.productId);
        if (!manual) return null;

        return {
          id: purchase.productId,
          name: manual.name,
          type: 'manual',
          imageUrl: typeof manual.imageUrl === 'string' ? manual.imageUrl : '',
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
          type: 'workshop',
          imageUrl:
            typeof workshop.imageUrl === 'string' ? workshop.imageUrl : '',
          description: workshop.description,
        };
      }

      return null;
    },
  );

  const results = await Promise.all(enrichmentPromises);
  return results.reduce<PurchasedResourceResponse[]>((acc, item) => {
    if (item !== null) {
      acc.push(item);
    }
    return acc;
  }, []);
};
