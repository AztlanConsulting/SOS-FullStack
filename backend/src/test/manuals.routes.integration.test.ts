import express from 'express';
import request from 'supertest';
import manualRoutes from '@interfaces/routes/manuals.routes';
import { ManualDataAccess } from '@interfaces/data-access/manual.data-access';

describe('manuals routes (integration)', () => {
  // Minimal express app wired with real manuals routes.
  const app = express();
  app.use('/manuals', manualRoutes);

  afterEach(() => {
    // Reset spies to keep tests independent.
    jest.restoreAllMocks();
  });

  test('GET /manuals/getManuals returns list and total when page query is provided', async () => {
    // Mock only data-access calls; route/controller/use-case flow is real.
    jest.spyOn(ManualDataAccess, 'getManuals').mockResolvedValue([
      {
        name: 'Manual C',
        price: 180,
        content: 'Contenido C',
        imageUrl: 'c.jpg',
      },
    ]);
    jest.spyOn(ManualDataAccess, 'getTotalManuals').mockResolvedValue(1);

    const res = await request(app)
      .get('/manuals/getManuals')
      .query({ page: 0, sortOption: 'Nombre (A-Z)', searchTerm: 'Manual' });

    // Success payload should include list and total count.
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      manuals: [
        {
          name: 'Manual C',
          price: 180,
          content: 'Contenido C',
          imageUrl: 'c.jpg',
        },
      ],
      total: 1,
    });
    expect(ManualDataAccess.getManuals).toHaveBeenCalledWith({
      page: 0,
      sortOption: 'Nombre (A-Z)',
      searchTerm: 'Manual',
    });
  });

  test('GET /manuals/getManuals returns one manual when id query is provided', async () => {
    // Id branch should bypass list query and return a one-item array.
    jest.spyOn(ManualDataAccess, 'getManualById').mockResolvedValue({
      name: 'Manual Id',
      price: 220,
      content: 'Contenido Id',
      imageUrl: 'id.jpg',
    });

    const res = await request(app)
      .get('/manuals/getManuals')
      .query({ id: 'abc123', sortOption: 'Nombre (A-Z)' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      manuals: [
        {
          name: 'Manual Id',
          price: 220,
          content: 'Contenido Id',
          imageUrl: 'id.jpg',
        },
      ],
      total: 0,
    });
  });

  test('GET /manuals/getManuals returns 404 when id does not exist', async () => {
    // Null from data-access should map to 404 in controller.
    jest.spyOn(ManualDataAccess, 'getManualById').mockResolvedValue(null);

    const res = await request(app)
      .get('/manuals/getManuals')
      .query({ id: 'missing-id', sortOption: 'Nombre (A-Z)' });

    expect(res.status).toBe(404);
    expect(res.text).toBe('No se encontró el taller con id: missing-id');
  });

  test('GET /manuals/getManuals returns 500 when required query is missing', async () => {
    // Missing page/id violates zod refinement and triggers error path.
    const res = await request(app)
      .get('/manuals/getManuals')
      .query({ sortOption: 'Nombre (A-Z)' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
