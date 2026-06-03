import express from 'express';
import request from 'supertest';
import resourcesRoutes from '@interfaces/routes/resources.routes';
import { connect, clearDatabase, closeDatabase } from '../db';
import initWorkshopDB from '@infrastructure/database/mongoDB/data/workshops.data';
import initManualDB from '@infrastructure/database/mongoDB/data/manuals.data';

jest.mock('@interfaces/middleware/auth.middleware', () => ({
  authMiddleware: (_req: unknown, _res: unknown, next: () => void) => next(),
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) =>
    next(),
}));

describe('resources routes (integration)', () => {
  const app = express();
  app.use('/resources', resourcesRoutes);

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await clearDatabase();
    await initWorkshopDB();
    await initManualDB();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('GET /resources returns a merged list and total', async () => {
    const res = await request(app)
      .get('/resources')
      .query({ page: 0, sortOption: 'Nombre (A-Z)', searchTerm: 'Manual' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('resources');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.resources)).toBe(true);
    expect(res.body.resources.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.resources[0]).toHaveProperty('type');
    expect(res.body.resources[0]).toHaveProperty('resourceUrl');
  });

  it('GET /resources filters by typeOption', async () => {
    const res = await request(app).get('/resources').query({
      page: 0,
      sortOption: 'Nombre (A-Z)',
      searchTerm: 'Manual',
      typeOption: 'Manual',
    });

    expect(res.status).toBe(200);
    expect(res.body.resources.length).toBeGreaterThan(0);
    expect(
      res.body.resources.every(
        (resource: { type: string }) => resource.type === 'Manual',
      ),
    ).toBe(true);
  });

  it('GET /resources?id= returns a single resource by id', async () => {
    const listRes = await request(app)
      .get('/resources')
      .query({ page: 0, sortOption: 'Nombre (A-Z)', searchTerm: 'Manual' });

    const resourceId = listRes.body.resources[0]._id;

    const res = await request(app).get('/resources').query({ id: resourceId });

    expect(res.status).toBe(200);
    expect(res.body.resources).toHaveLength(1);
    expect(res.body.resources[0]._id).toBe(resourceId);
  });

  it('GET /resources returns 400 when page and id are missing', async () => {
    const res = await request(app)
      .get('/resources')
      .query({ sortOption: 'Nombre (A-Z)' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('name');
  });

  it('DELETE /resources/:id deletes a workshop and returns 200', async () => {
    const listRes = await request(app)
      .get('/resources')
      .query({ page: 0, sortOption: 'Nombre (A-Z)', typeOption: 'Taller' });

    const workshopId = listRes.body.resources[0]._id;
    const res = await request(app).delete(`/resources/${workshopId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Recurso eliminado correctamente',
    );
  });

  it('DELETE /resources/:id deletes a manual and returns 200', async () => {
    const listRes = await request(app)
      .get('/resources')
      .query({ page: 0, sortOption: 'Nombre (A-Z)', typeOption: 'Manual' });

    const manualId = listRes.body.resources[0]._id;
    const res = await request(app).delete(`/resources/${manualId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Recurso eliminado correctamente',
    );
  });

  it('DELETE /resources/:id returns 404 for a non-existent id', async () => {
    const res = await request(app).delete(
      '/resources/000000000000000000000000',
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /resources/:id removes the resource from subsequent GET requests', async () => {
    const listRes = await request(app)
      .get('/resources')
      .query({ page: 0, sortOption: 'Nombre (A-Z)' });

    const resourceId = listRes.body.resources[0]._id;

    await request(app).delete(`/resources/${resourceId}`);

    const afterRes = await request(app)
      .get('/resources')
      .query({ id: resourceId });

    expect(afterRes.body.resources).toHaveLength(0);
  });
});
