import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import { createLostPetReport } from '@/use-cases/clients/createLostPetReport.usecase';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { petDataAccess } from '@/infrastructure/data-access/pet.data-access';
import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';
import { roleDataAccess } from '@/infrastructure/data-access/role.data-access';
import { RoleModel } from '@/domain/models/role.model';
import type { RoleRepository } from '@/domain/repositories/role.repository';

describe('createLostPetReport (integration)', () => {
  beforeAll(async () => {
    await mongoDB('test');

    await RoleModel.create({
      role: 'CLIENT',
      permissions: [],
    });
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  const createInput = (email: string) => ({
    name: 'Firulais',
    species: 'Perro',
    date: '2024-03-09',
    breed: 'Labrador',
    sex: 'Macho',
    color: 'Café',
    size: 'Mediana: 11 a 25 kg',
    description: 'Perrito amigable con collar azul.',
    location: 'Querétaro',
    locationCoords: [20.5888, -100.3899] as [number, number],
    contactName: 'Juan Pérez',
    phoneNumber: '5551234567',
    email,
    planName: 'Premium',
    planDetails: {
      days: 30,
      km: 5,
      selectedFeatures: ['highlight'],
      totalPrice: 199,
    },
    images: ['img1.jpg'],
  });

  test('creates pet, plan and user in MongoDB', async () => {
    const email = `test-${Date.now()}@example.com`;

    const result = await createLostPetReport(
      {
        userRepository: userDataAccess,
        petRepository: petDataAccess,
        purchasedPlanRepository: purchasedPlanDataAccess,
        roleRepository: roleDataAccess,
      },
      createInput(email),
    );

    expect(result.pet).toBeDefined();
    expect(result.plan).toBeDefined();
    expect(result.pet._id).toBeDefined();
    expect(result.plan._id).toBeDefined();
  });

  test('reuses existing user if email already exists', async () => {
    const email = `existing-${Date.now()}@example.com`;

    await createLostPetReport(
      {
        userRepository: userDataAccess,
        petRepository: petDataAccess,
        purchasedPlanRepository: purchasedPlanDataAccess,
        roleRepository: roleDataAccess,
      },
      createInput(email),
    );

    const second = await createLostPetReport(
      {
        userRepository: userDataAccess,
        petRepository: petDataAccess,
        purchasedPlanRepository: purchasedPlanDataAccess,
        roleRepository: roleDataAccess,
      },
      createInput(email),
    );

    expect(second.pet._id).toBeDefined();
  });

  test('throws if CLIENT role does not exist', async () => {
    const email = `fail-${Date.now()}@example.com`;

    const roleRepoMock: RoleRepository = {
      getRoleIdByName: jest.fn().mockResolvedValue(null),
    } as unknown as RoleRepository;

    await expect(
      createLostPetReport(
        {
          userRepository: userDataAccess,
          petRepository: petDataAccess,
          purchasedPlanRepository: purchasedPlanDataAccess,
          roleRepository: roleRepoMock,
        },
        createInput(email),
      ),
    ).rejects.toThrow('CLIENT_ROLE_NOT_FOUND');
  });
});
