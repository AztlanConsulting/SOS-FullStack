import { createLostPetReport } from '@/use-cases/clients/createLostPetReport.usecase';
import type { CreateLostPetReportInput } from '@/use-cases/clients/createLostPetReport.usecase';
import type { UserRepository } from '@/domain/repositories/user.repository';
import type { PetRepository } from '@/domain/repositories/pet.repository';
import type { PurchasedPlanRepository } from '@/domain/repositories/purchasedPlan.repository';
import type { RoleRepository } from '@/domain/repositories/role.repository';
import { Types } from 'mongoose';

describe('createLostPetReport', () => {
  let userRepo: jest.Mocked<UserRepository>;
  let petRepo: jest.Mocked<PetRepository>;
  let planRepo: jest.Mocked<PurchasedPlanRepository>;
  let roleRepo: jest.Mocked<RoleRepository>;

  const MOCK_PET_DATA: CreateLostPetReportInput = {
    name: 'Firulais',
    species: 'Perro',
    date: '2024-03-09',
    breed: 'Labrador',
    sex: 'Macho',
    color: 'Café',
    size: 'Mediana: 11 a 25 kg',
    description: 'Perrito amigable con collar azul.',
    location: 'Querétaro',
    locationCoords: [20.5888, -100.3899],
    contactName: 'Juan Pérez',
    phoneNumber: '5551234567',
    email: 'juan@example.com',
    planName: 'Premium',
    planDetails: {
      days: 30,
      km: 5,
      selectedFeatures: ['highlight'],
      totalPrice: 199,
    },
    images: ['img1.jpg'],
  };

  const validObjectId = new Types.ObjectId().toString();

  beforeEach(() => {
    userRepo = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    petRepo = {
      createPet: jest.fn(),
    } as unknown as jest.Mocked<PetRepository>;

    planRepo = {
      createPurchasedPlan: jest.fn(),
    } as unknown as jest.Mocked<PurchasedPlanRepository>;

    roleRepo = {
      getRoleIdByName: jest.fn(),
    } as unknown as jest.Mocked<RoleRepository>;
  });

  test('creates user, pet and plan when user does not exist', async () => {
    userRepo.getUserByEmail.mockResolvedValue(null);
    roleRepo.getRoleIdByName.mockResolvedValue(validObjectId);
    userRepo.createUser.mockResolvedValue(validObjectId);

    petRepo.createPet.mockResolvedValue({
      _id: new Types.ObjectId(),
    } as never);

    planRepo.createPurchasedPlan.mockResolvedValue({
      _id: new Types.ObjectId(),
    } as never);

    const result = await createLostPetReport(
      {
        userRepository: userRepo,
        petRepository: petRepo,
        purchasedPlanRepository: planRepo,
        roleRepository: roleRepo,
      },
      MOCK_PET_DATA,
    );

    expect(userRepo.createUser).toHaveBeenCalledTimes(1);
    expect(petRepo.createPet).toHaveBeenCalledTimes(1);
    expect(planRepo.createPurchasedPlan).toHaveBeenCalledTimes(1);

    expect(result.pet._id).toBeDefined();
    expect(result.plan._id).toBeDefined();
  });

  test('does NOT create user if already exists', async () => {
    userRepo.getUserByEmail.mockResolvedValue({
      _id: new Types.ObjectId(),
    } as never);

    petRepo.createPet.mockResolvedValue({
      _id: new Types.ObjectId(),
    } as never);

    planRepo.createPurchasedPlan.mockResolvedValue({
      _id: new Types.ObjectId(),
    } as never);

    await createLostPetReport(
      {
        userRepository: userRepo,
        petRepository: petRepo,
        purchasedPlanRepository: planRepo,
        roleRepository: roleRepo,
      },
      MOCK_PET_DATA,
    );

    expect(userRepo.createUser).not.toHaveBeenCalled();
  });

  test('throws error if CLIENT role is missing', async () => {
    userRepo.getUserByEmail.mockResolvedValue(null);
    roleRepo.getRoleIdByName.mockResolvedValue(null);

    await expect(
      createLostPetReport(
        {
          userRepository: userRepo,
          petRepository: petRepo,
          purchasedPlanRepository: planRepo,
          roleRepository: roleRepo,
        },
        MOCK_PET_DATA,
      ),
    ).rejects.toThrow('CLIENT_ROLE_NOT_FOUND');
  });
});
