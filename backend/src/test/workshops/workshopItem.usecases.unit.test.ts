import { createWorkshop } from '@use-cases/workshops/createWorkshop.usecase';
import { createManual } from '@use-cases/manuals/createManual.usecase';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';
import type { ManualRepository } from '@domain/repositories/manual.repository';

describe('createWorkshop use-case (unit)', () => {
  const workshopPayload = {
    name: 'Taller de prueba',
    description: 'Descripción de prueba',
    price: 500,
    content: [{ type: 'texto', content: 'Hola mundo' }],
    category: ['test'],
    imageUrl: 'https://example.com/image.jpg',
    videoUrl: 'https://example.com/video.mp4',
    emailContent: 'Gracias por tu compra',
  };

  const buildWorkshopRepo = (overrides = {}): WorkshopRepository => ({
    getWorkshops: jest.fn(),
    getWorkshopById: jest.fn(),
    getWorkshopByCategory: jest.fn(),
    getTotalWorkshops: jest.fn(),
    createWorkshop: jest.fn().mockResolvedValue({
      workshopId: 'workshop-123',
      error: null,
    }),
    updateResourceById: jest.fn(),
    deleteWorkshop: jest.fn(),
    ...overrides,
  });

  test('createWorkshop returns the workshopId on success', async () => {
    const repo = buildWorkshopRepo();

    const result = await createWorkshop(repo, workshopPayload as any);

    expect(repo.createWorkshop).toHaveBeenCalledWith(workshopPayload);
    expect(result).toBe('workshop-123');
  });

  test('createWorkshop throws when repository returns an error', async () => {
    const repo = buildWorkshopRepo({
      createWorkshop: jest.fn().mockResolvedValue({
        workshopId: null,
        error: 'Error al crear el taller',
      }),
    });

    await expect(createWorkshop(repo, workshopPayload as any)).rejects.toThrow(
      'Error al crear el taller',
    );
  });

  test('createWorkshop propagates unexpected repository exceptions', async () => {
    const repo = buildWorkshopRepo({
      createWorkshop: jest.fn().mockRejectedValue(new Error('db crashed')),
    });

    await expect(createWorkshop(repo, workshopPayload as any)).rejects.toThrow(
      'db crashed',
    );
  });
});

describe('createManual use-case (unit)', () => {
  const manualPayload = {
    name: 'Manual de prueba',
    price: 200,
    content: [{ type: 'texto', content: 'Contenido del manual' }],
    imageUrl: 'https://example.com/image.jpg',
    pdfUrl: 'https://example.com/manual.pdf',
  };

  const buildManualRepo = (overrides = {}): ManualRepository => ({
    getManuals: jest.fn(),
    getTotalManuals: jest.fn(),
    getManualById: jest.fn(),
    createManual: jest.fn().mockResolvedValue({
      manualId: 'manual-456',
      error: null,
    }),
    deleteManual: jest.fn(),
    ...overrides,
    updateResourceById: jest.fn(),
  });

  test('createManual returns the manualId on success', async () => {
    const repo = buildManualRepo();

    const result = await createManual(repo, manualPayload);

    expect(repo.createManual).toHaveBeenCalledWith(manualPayload);
    expect(result).toBe('manual-456');
  });

  test('createManual throws when repository returns an error', async () => {
    const repo = buildManualRepo({
      createManual: jest.fn().mockResolvedValue({
        manualId: null,
        error: 'Error al crear el manual',
      }),
    });

    await expect(createManual(repo, manualPayload)).rejects.toThrow(
      'Error al crear el manual',
    );
  });

  test('createManual propagates unexpected repository exceptions', async () => {
    const repo = buildManualRepo({
      createManual: jest.fn().mockRejectedValue(new Error('db crashed')),
    });

    await expect(createManual(repo, manualPayload)).rejects.toThrow(
      'db crashed',
    );
  });
});
