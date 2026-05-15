import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Types } from 'mongoose';
import { getPlanProgress } from '@/use-cases/clients/getPlanProgress.usecase';

describe('getPlanProgress', () => {
  const petRepository = {
    getPetByUserId: jest.fn(),
  };

  const purchasedPlanRepository = {
    getActivePlanByPetId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna null si no existe la mascota', async () => {
    petRepository.getPetByUserId.mockResolvedValue(null);

    const result = await getPlanProgress(
      {
        petRepository: petRepository as any,
        purchasedPlanRepository: purchasedPlanRepository as any,
      },
      'user-1',
    );

    expect(result).toBeNull();
  });

  test('retorna null si no existe plan activo', async () => {
    petRepository.getPetByUserId.mockResolvedValue({
      _id: new Types.ObjectId(),
      photos: [],
    });
    purchasedPlanRepository.getActivePlanByPetId.mockResolvedValue(null);

    const result = await getPlanProgress(
      {
        petRepository: petRepository as any,
        purchasedPlanRepository: purchasedPlanRepository as any,
      },
      'user-1',
    );

    expect(result).toBeNull();
  });

  test('construye el resultado correcto', async () => {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - 5);

    petRepository.getPetByUserId.mockResolvedValue({
      _id: new Types.ObjectId('64b64b64b64b64b64b64b64b'),
      name: 'Firulais',
      dateMissing: new Date('2026-05-01T00:00:00.000Z'),
      photos: ['/img-1.jpg', '/poster.jpg'],
    });

    purchasedPlanRepository.getActivePlanByPetId.mockResolvedValue({
      name: 'Básico',
      duration: 30,
      createdAt,
    });

    const result = await getPlanProgress(
      {
        petRepository: petRepository as any,
        purchasedPlanRepository: purchasedPlanRepository as any,
      },
      'user-1',
    );

    expect(result?.planName).toBe('Básico');
    expect(result?.petName).toBe('Firulais');
    expect(result?.petImage).toBe('/img-1.jpg');
    expect(result?.posterImage).toBe('/poster.jpg');
    expect(result?.totalDays).toBe(30);
    expect(result?.daysRemaining).toBeGreaterThanOrEqual(24);
  });
});
