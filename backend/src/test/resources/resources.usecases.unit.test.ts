import { getResourcesList } from '@use-cases/resources/getResources.usecase';
import { deleteResource } from '@use-cases/resources/deleteResource.usecase';
import {
  getManualByIdDB,
  getManualsDB,
} from '@use-cases/manuals/getManualsDB.usecase';
import {
  getWorkshopById,
  getWorkshopList,
} from '@use-cases/workshops/getWorkshops.usecase';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';
import type { ManualRepository } from '@domain/repositories/manual.repository';

jest.mock('@use-cases/manuals/getManualsDB.usecase', () => ({
  getManualsDB: jest.fn(),
  getManualByIdDB: jest.fn(),
}));

jest.mock('@use-cases/workshops/getWorkshops.usecase', () => ({
  getWorkshopList: jest.fn(),
  getWorkshopById: jest.fn(),
}));

describe('deleteResource use-case (unit)', () => {
  const workshopRepo = {
    deleteWorkshop: jest.fn(),
  } as unknown as WorkshopRepository;
  const manualRepo = {
    deleteManual: jest.fn(),
  } as unknown as ManualRepository;

  beforeEach(() => jest.clearAllMocks());

  it('deletes a workshop and returns true without checking manuals', async () => {
    jest.mocked(workshopRepo.deleteWorkshop).mockResolvedValueOnce(true);

    const result = await deleteResource(workshopRepo, manualRepo, 'w1');

    expect(workshopRepo.deleteWorkshop).toHaveBeenCalledWith('w1');
    expect(manualRepo.deleteManual).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('falls back to manuals when the id does not match a workshop', async () => {
    jest.mocked(workshopRepo.deleteWorkshop).mockResolvedValueOnce(false);
    jest.mocked(manualRepo.deleteManual).mockResolvedValueOnce(true);

    const result = await deleteResource(workshopRepo, manualRepo, 'm1');

    expect(workshopRepo.deleteWorkshop).toHaveBeenCalledWith('m1');
    expect(manualRepo.deleteManual).toHaveBeenCalledWith('m1');
    expect(result).toBe(true);
  });

  it('returns false when the id matches neither a workshop nor a manual', async () => {
    jest.mocked(workshopRepo.deleteWorkshop).mockResolvedValueOnce(false);
    jest.mocked(manualRepo.deleteManual).mockResolvedValueOnce(false);

    const result = await deleteResource(workshopRepo, manualRepo, 'unknown');

    expect(result).toBe(false);
  });
});

describe('resources use-cases (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('merges, filters, sorts and paginates workshops and manuals', async () => {
    jest.mocked(getWorkshopList).mockResolvedValueOnce({
      workshops: [
        {
          _id: 'w1',
          name: 'Workshop B',
          price: 60,
          imageUrl: 'w1.jpg',
          content: [{ type: 'text', content: 'Workshop B' }],
          videoUrl: 'https://workshop-b',
        },
      ],
      totalWorkshops: 1,
    } as never);
    jest.mocked(getManualsDB).mockResolvedValueOnce({
      manuals: [
        {
          _id: 'm1',
          name: 'Manual Z',
          price: 20,
          imageUrl: 'm1.jpg',
          content: [{ type: 'text', content: 'Manual Z' }],
          pdfUrl: 'https://manual-z',
        },
        {
          _id: 'm2',
          name: 'Manual A',
          price: 10,
          imageUrl: 'm2.jpg',
          content: [{ type: 'text', content: 'Manual A' }],
          pdfUrl: 'https://manual-a',
        },
      ],
      totalManuals: 2,
    } as never);

    const result = await getResourcesList({} as never, {} as never, {
      page: 0,
      sortOption: 'Nombre (A-Z)',
      typeOption: 'Manual',
    });

    expect(getWorkshopList).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ page: 0, sortOption: 'Nombre (A-Z)' }),
    );
    expect(getManualsDB).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ page: 0, sortOption: 'Nombre (A-Z)' }),
    );
    expect(result.totalResources).toBe(2);
    expect(result.resources).toHaveLength(2);
    expect(result.resources.map((resource) => resource.name)).toEqual([
      'Manual A',
      'Manual Z',
    ]);
    expect(
      result.resources.every((resource) => resource.type === 'Manual'),
    ).toBe(true);
  });

  it('returns a single normalized resource when id is provided', async () => {
    jest.mocked(getWorkshopById).mockResolvedValueOnce({
      _id: 'w1',
      name: 'Workshop 1',
      price: 75,
      imageUrl: 'w1.jpg',
      content: [{ type: 'text', content: 'Workshop 1' }],
      videoUrl: 'https://workshop-1',
    } as never);

    const result = await getResourcesList({} as never, {} as never, {
      id: 'w1',
    });

    expect(getWorkshopById).toHaveBeenCalledWith({}, 'w1');
    expect(getManualByIdDB).not.toHaveBeenCalled();
    expect(result.totalResources).toBe(1);
    expect(result.resources).toHaveLength(1);
    expect(result.resources[0]).toMatchObject({
      _id: 'w1',
      name: 'Workshop 1',
      type: 'Taller',
      resourceUrl: 'https://workshop-1',
    });
  });
});
