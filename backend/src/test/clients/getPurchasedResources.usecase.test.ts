import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { getPurchasedResources } from '@/use-cases/clients/getPurchasedResources.usecase';

describe('getPurchasedResources', () => {
  const purchaseRepository = {
    getPurchasesByUserEmail: jest.fn(),
  };

  const manualRepository = {
    getManualById: jest.fn(),
  };

  const workshopRepository = {
    getWorkshopById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna [] si no hay compras', async () => {
    purchaseRepository.getPurchasesByUserEmail.mockResolvedValue([]);

    const result = await getPurchasedResources(
      {
        purchaseRepository: purchaseRepository as any,
        manualRepository: manualRepository as any,
        workshopRepository: workshopRepository as any,
      },
      'user@test.com',
    );

    expect(result).toEqual([]);
  });

  test('enriquece manuales y talleres', async () => {
    purchaseRepository.getPurchasesByUserEmail.mockResolvedValue([
      {
        userEmail: 'user@test.com',
        paymentId: '1',
        productId: 'm1',
        productType: 'manual',
      },
      {
        userEmail: 'user@test.com',
        paymentId: '2',
        productId: 'w1',
        productType: 'workshop',
      },
    ]);

    manualRepository.getManualById.mockResolvedValue({
      name: 'Manual A',
      imageUrl: '/manual.jpg',
    });

    workshopRepository.getWorkshopById.mockResolvedValue({
      name: 'Taller B',
      imageUrl: '/workshop.jpg',
      description: 'Desc',
    });

    const result = await getPurchasedResources(
      {
        purchaseRepository: purchaseRepository as any,
        manualRepository: manualRepository as any,
        workshopRepository: workshopRepository as any,
      },
      'user@test.com',
    );

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('manual');
    expect(result[1].type).toBe('workshop');
  });

  test('omite elementos no encontrados', async () => {
    purchaseRepository.getPurchasesByUserEmail.mockResolvedValue([
      {
        userEmail: 'user@test.com',
        paymentId: '1',
        productId: 'm1',
        productType: 'manual',
      },
    ]);

    manualRepository.getManualById.mockResolvedValue(null);

    const result = await getPurchasedResources(
      {
        purchaseRepository: purchaseRepository as any,
        manualRepository: manualRepository as any,
        workshopRepository: workshopRepository as any,
      },
      'user@test.com',
    );

    expect(result).toEqual([]);
  });
});
