import updateResourceUC from '@/use-cases/resources/updateResourceUC.usecase';
import type { ResourceRepository } from '@/domain/repositories/resource.repository';
import type { ManualRepository } from '@/domain/repositories/manual.repository';
import type { WorkshopRepository } from '@/domain/repositories/workshop.repository';

describe('updateResourceUC', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updates resource successfully', async () => {
    const mockManualRepository: ManualRepository = {
      updateResourceById: jest.fn().mockResolvedValue(true),
    } as any;
    const mockWorkshopRepository: WorkshopRepository = {
      updateResourceById: jest.fn().mockResolvedValue(true),
    } as any;

    const result = await updateResourceUC(
      {
        ManualDataAccess: mockManualRepository,
        WorkshopDataAccess: mockWorkshopRepository,
      },
      {
        _id: '12345678',
        name: 'New Resource',
        price: 50,
      },
      'workshop',
    );

    expect(mockWorkshopRepository.updateResourceById).toHaveBeenCalledWith({
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
    const mockManualRepository: ManualRepository = {
      updateResourceById: jest.fn().mockResolvedValue(false),
      getManualById: jest.fn().mockResolvedValue(false),
    } as any;
    const mockWorkshopRepository: WorkshopRepository = {
      updateResourceById: jest.fn().mockResolvedValue(false),
    } as any;

    const result = await updateResourceUC(
      {
        ManualDataAccess: mockManualRepository,
        WorkshopDataAccess: mockWorkshopRepository,
      },
      {
        _id: '12345678',
      },
      'workshop',
    );

    expect(result).toEqual({
      success: false,
      error: "Couldn't find or update resource",
    });
  });
});
