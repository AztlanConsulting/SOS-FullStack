import { createFoundPet } from '@use-cases/foundPet/createFoundPet.usecase';
import type {
  FoundPetRepository,
  FoundPetResult,
} from '@domain/repositories/foundPet.repository';
import { Types } from 'mongoose';

describe('foundPet createFoundPet (unit)', () => {
  const validFoundPetData = {
    _id: new Types.ObjectId(),
    species: 'Perro',
    date: '2024-03-15',
    breed: 'Labrador',
    sex: 'Macho' as const,
    color: 'Dorado',
    size: 'Mediana: 11 a 25 kg' as const,
    description: 'Perro amigable con collar rojo',
    location: 'Parque Central',
    locationCoords: [-99.1332, 19.4326] as [number, number],
    contactName: 'Juan Perez',
    phoneNumber: '+521234567890',
    email: 'juan@example.com',
  };

  test('createFoundPet returns result from repository', async () => {
    const mockResult: FoundPetResult = {
      ...validFoundPetData,
      _id: 'mock-id-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const repo: FoundPetRepository = {
      createFoundPet: jest.fn().mockResolvedValue(mockResult),
      getFoundPetById: jest.fn(),
      getAllFoundPets: jest.fn(),
      updateFoundPet: jest.fn(),
      deleteFoundPet: jest.fn(),
    };

    const result = await createFoundPet(repo, validFoundPetData);

    expect(repo.createFoundPet).toHaveBeenCalledWith(validFoundPetData);
    expect(result).toEqual(mockResult);
  });

  test('createFoundPet propagates repository errors', async () => {
    const repo: FoundPetRepository = {
      createFoundPet: jest.fn().mockRejectedValue(new Error('db failed')),
      getFoundPetById: jest.fn(),
      getAllFoundPets: jest.fn(),
      updateFoundPet: jest.fn(),
      deleteFoundPet: jest.fn(),
    };

    await expect(createFoundPet(repo, validFoundPetData)).rejects.toThrow(
      'db failed',
    );
  });
});
