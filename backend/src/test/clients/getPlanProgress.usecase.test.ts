import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { Types } from 'mongoose';
import { getPlanProgress } from '@/use-cases/clients/getPlanProgress.usecase';
import type { PetRepository } from '@/domain/repositories/pet.repository';
import type { PurchasedPlanRepository } from '@/domain/repositories/purchasedPlan.repository';
import type { Pet } from '@/domain/models/pet.model';
import type { PurchasedPlan } from '@/domain/models/purchasedPlan.model';

const createPet = (overrides: Partial<Pet> = {}): Pet => ({
  _id: new Types.ObjectId('64b64b64b64b64b64b64b64b'),
  userId: new Types.ObjectId('65b65b65b65b65b65b65b65b'),
  name: 'Firulais',
  species: 'Perro',
  dateMissing: new Date('2026-05-01T12:00:00.000Z'),
  breed: 'Labrador',
  sex: 'Macho',
  color: 'Café',
  size: 'Mediana: 11 a 25 kg',
  description: 'Perrito amigable con collar azul.',
  photos: ['/uploads/pet.jpg', '/uploads/detail.jpg', '/uploads/poster.jpg'],
  location: {
    coords: [20.5888, -100.3899],
    displayName: 'Parque Alameda',
    properties: {
      city: 'Querétaro',
      country: 'México',
      state: 'Querétaro',
    },
  },
  createdAt: new Date('2026-05-01T12:00:00.000Z'),
  updatedAt: new Date('2026-05-01T12:00:00.000Z'),
  ...overrides,
});

const createPlan = (overrides: Partial<PurchasedPlan> = {}): PurchasedPlan => {
  const { status = 'continua', ...rest } = overrides;

  return {
    _id: new Types.ObjectId('66b66b66b66b66b66b66b66b'),
    petId: new Types.ObjectId('64b64b64b64b64b64b64b64b'),
    name: 'Básico',
    price: 390,
    duration: 30,
    radius: 10,
    features: ['Publicación en redes sociales'],
    active: true,
    status,
    createdAt: new Date('2026-05-08T12:00:00.000Z'),
    updatedAt: new Date('2026-05-08T12:00:00.000Z'),
    ...rest,
  };
};

describe('getPlanProgress', () => {
  let petRepository: jest.Mocked<PetRepository>;
  let purchasedPlanRepository: jest.Mocked<PurchasedPlanRepository>;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-18T12:00:00.000Z'));

    petRepository = {
      createPet: jest.fn(),
      getPetById: jest.fn(),
      getPetsByUserId: jest.fn(),
    };

    purchasedPlanRepository = {
      createPurchasedPlan: jest.fn(),
      getPurchasedPlanById: jest.fn(),
      getActivePlansByPetId: jest.fn(),
      activatePurchasedPlan: jest.fn(),
      updatePurchasedPlanSocialPosts: jest.fn(),
      updateEmailStatus: jest.fn(),
      getPlanDistribution: jest.fn(),
      updatePlanStatus: jest.fn(),
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns null when the user pet does not exist', async () => {
    petRepository.getPetsByUserId.mockResolvedValue([]);

    const result = await getPlanProgress(
      { petRepository, purchasedPlanRepository },
      'user-1',
    );

    expect(result).toBeNull();
    expect(petRepository.getPetsByUserId).toHaveBeenCalledWith('user-1');
    expect(
      purchasedPlanRepository.getActivePlansByPetId,
    ).not.toHaveBeenCalled();
  });

  test('returns null when the pet has no active plan', async () => {
    const pet = createPet();
    petRepository.getPetsByUserId.mockResolvedValue([pet]);
    purchasedPlanRepository.getActivePlansByPetId.mockResolvedValue(null);

    const result = await getPlanProgress(
      { petRepository, purchasedPlanRepository },
      'user-1',
    );

    expect(result).toEqual([]);
    expect(purchasedPlanRepository.getActivePlansByPetId).toHaveBeenCalledWith(
      pet._id.toString(),
    );
  });

  test('builds plan progress with plans, images, and location', async () => {
    const pet = createPet();
    const plan = createPlan();
    petRepository.getPetsByUserId.mockResolvedValue([pet]);
    purchasedPlanRepository.getActivePlansByPetId.mockResolvedValue([plan]);

    const result = await getPlanProgress(
      { petRepository, purchasedPlanRepository },
      'user-1',
    );

    expect(result).toEqual([
      {
        petId: pet._id.toString(),
        plans: [
          {
            name: 'Básico',
            duration: 30,
            createdAt: new Date('2026-05-08T12:00:00.000Z'),
          },
        ],
        petName: 'Firulais',
        petImage: '/uploads/pet.jpg',
        planStatus: 'continua',
        posterImage: '/uploads/poster.jpg',
        dateMissing: pet.dateMissing,
        location: 'Parque Alameda',
      },
    ]);
  });

  test('uses the first user pet that has an active plan', async () => {
    const petWithoutPlan = createPet({
      _id: new Types.ObjectId('67b67b67b67b67b67b67b67b'),
      name: 'Sin plan',
    });
    const petWithPlan = createPet({
      _id: new Types.ObjectId('68b68b68b68b68b68b68b68b'),
      name: 'Con plan',
      photos: ['/uploads/active-pet.jpg', '/uploads/active-poster.jpg'],
    });
    const activePlan = createPlan({
      petId: petWithPlan._id,
      name: 'Premium',
    });

    petRepository.getPetsByUserId.mockResolvedValue([
      petWithoutPlan,
      petWithPlan,
    ]);
    purchasedPlanRepository.getActivePlansByPetId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([activePlan]);

    const result = await getPlanProgress(
      { petRepository, purchasedPlanRepository },
      'user-1',
    );

    expect(result).toEqual([
      {
        petId: petWithPlan._id.toString(),
        plans: [
          {
            name: 'Premium',
            duration: 30,
            createdAt: new Date('2026-05-08T12:00:00.000Z'),
          },
        ],
        petName: 'Con plan',
        petImage: '/uploads/active-pet.jpg',
        planStatus: 'continua',
        posterImage: '/uploads/active-poster.jpg',
        dateMissing: petWithPlan.dateMissing,
        location: 'Parque Alameda',
      },
    ]);
    expect(
      purchasedPlanRepository.getActivePlansByPetId,
    ).toHaveBeenNthCalledWith(1, petWithoutPlan._id.toString());
    expect(
      purchasedPlanRepository.getActivePlansByPetId,
    ).toHaveBeenNthCalledWith(2, petWithPlan._id.toString());
  });
});
