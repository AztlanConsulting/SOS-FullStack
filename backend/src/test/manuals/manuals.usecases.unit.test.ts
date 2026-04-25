import {
  getManualsDB,
  getManualByIdDB,
} from '@use-cases/manuals/getManualsDB.usecase';
import type {
  GetManual,
  ManualRepository,
} from '@domain/repositories/manual.repository';

describe('manuals use-cases (unit)', () => {
  // Shared query object used to assert repository contract calls.
  const request: GetManual = {
    page: 0,
    searchTerm: 'perro',
    sortOption: 'Nombre (A-Z)',
  };

  test('getManualsDB returns manuals and total from repository', async () => {
    // Repository is fully mocked to isolate use-case orchestration.
    const repo: ManualRepository = {
      getManuals: jest.fn().mockResolvedValue([
        {
          name: 'Manual A',
          price: 100,
          content: [
            {
              type: 'text',
              content: 'Contenido A',
            },
          ],
          imageUrl: 'a.jpg',
        },
      ]),
      getTotalManuals: jest.fn().mockResolvedValue(1),
      getManualById: jest.fn(),
    };

    const result = await getManualsDB(repo, request);

    // Validate that the use-case delegates to both repository methods.
    expect(repo.getManuals).toHaveBeenCalledWith(request);
    expect(repo.getTotalManuals).toHaveBeenCalledWith(request);
    expect(result).toEqual({
      manuals: [
        {
          name: 'Manual A',
          price: 100,
          content: [
            {
              type: 'text',
              content: 'Contenido A',
            },
          ],
          imageUrl: 'a.jpg',
        },
      ],
      totalManuals: 1,
    });
  });

  test('getManualsDB propagates repository errors', async () => {
    // Use-case should not swallow repository failures.
    const repo: ManualRepository = {
      getManuals: jest.fn().mockRejectedValue(new Error('db failed')),
      getTotalManuals: jest.fn(),
      getManualById: jest.fn(),
    };

    await expect(getManualsDB(repo, request)).rejects.toThrow('db failed');
  });

  test('getManualByIdDB returns the repository result', async () => {
    // getManualByIdDB is a pass-through that should return data unchanged.
    const repo: ManualRepository = {
      getManuals: jest.fn(),
      getTotalManuals: jest.fn(),
      getManualById: jest.fn().mockResolvedValue({
        name: 'Manual B',
        price: 250,
        content: [
          {
            type: 'text',
            content: 'Contenido B',
          },
        ],
        imageUrl: 'b.jpg',
      }),
    };

    const result = await getManualByIdDB(repo, 'manual-1');

    expect(repo.getManualById).toHaveBeenCalledWith('manual-1');
    expect(result).toEqual({
      name: 'Manual B',
      price: 250,
      content: [
        {
          type: 'text',
          content: 'Contenido B',
        },
      ],
      imageUrl: 'b.jpg',
    });
  });

  test('getManualByIdDB returns null when repository has no result', async () => {
    // Null should be preserved for not-found results.
    const repo: ManualRepository = {
      getManuals: jest.fn(),
      getTotalManuals: jest.fn(),
      getManualById: jest.fn().mockResolvedValue(null),
    };

    const result = await getManualByIdDB(repo, 'missing-id');

    expect(result).toBeNull();
  });
});
