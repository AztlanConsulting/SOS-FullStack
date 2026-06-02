import express from 'express';
import request from 'supertest';
import resourcesRoutes from '@interfaces/routes/resources.routes';
import { connect, clearDatabase, closeDatabase } from '../db';
import initWorkshopDB from '@infrastructure/database/mongoDB/data/workshops.data';
import initManualDB from '@infrastructure/database/mongoDB/data/manuals.data';

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
});
