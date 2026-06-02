import updateResourceUC from '@/use-cases/resources/updateResourceUC.usecase';
import type { ResourceRepository } from '@/domain/repositories/resource.repository';

describe('updateResourceUC', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updates resource successfully', async () => {
    const mockRepository: ResourceRepository = {
      updateResourceById: jest.fn().mockResolvedValue(true),
    } as any;

    const result = await updateResourceUC(mockRepository, {
      _id: '12345678',
      name: 'New Resource',
      price: 50,
    });

    expect(mockRepository.updateResourceById).toHaveBeenCalledWith({
      _id: '12345678',
      name: 'New Resource',
      price: 50,
    });

    expect(result).toEqual({
      success: true,
      error: null,
    });
  });

  test('returns error when resource does not exist', async () => {
    const mockRepository: ResourceRepository = {
      updateResourceById: jest.fn().mockResolvedValue(false),
    } as any;

    const result = await updateResourceUC(mockRepository, {
      _id: '12345678',
    });

    expect(result).toEqual({
      success: false,
      error: "Couldn't find or update resource",
    });
  });

  test('returns error when repository is null', async () => {
    const result = await updateResourceUC(null, {
      _id: '12345678',
    });

    expect(result).toEqual({
      success: false,
      error: "Couldn't find or update resource",
    });
  });
});
