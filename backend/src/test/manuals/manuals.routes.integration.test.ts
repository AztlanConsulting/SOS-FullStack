import express from 'express';
import request from 'supertest';
import manualRoutes from '@interfaces/routes/manuals.routes';
import { connect, closeDatabase, clearDatabase } from '../db';
import initManualDB from '@infrastructure/database/mongoDB/data/manuals.data';

describe('manuals routes (integration)', () => {
  // Minimal express app wired with real manuals routes.
  const app = express();
  app.use('/manuals', manualRoutes);

  beforeAll(async () => {
    // Connect to in-memory MongoDB for testing
    await connect();
  });

  beforeEach(async () => {
    // Clear database and reinitialize with fresh test data
    await clearDatabase();
    await initManualDB();
  });

  afterAll(async () => {
    // Close database connection and stop the in-memory server
    await closeDatabase();
  });

  test('GET /manuals/getManuals returns list and total when page query is provided', async () => {
    // Real data-access flow: routes → controllers → data-access → MongoDB
    const res = await request(app)
      .get('/manuals/getManuals')
      .query({ page: 0, sortOption: 'Nombre (A-Z)', searchTerm: 'Manual' });

    // Success payload should include list and total count from real database
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('manuals');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.manuals)).toBe(true);
    expect(typeof res.body.total).toBe('number');
    // initManualDB inserts 35 manuals matching the name pattern
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.manuals.length).toBeGreaterThan(0);
  });

  test('GET /manuals/getManuals returns one manual when id query is provided', async () => {
    // First, get a real manual ID from the database
    const getRes = await request(app)
      .get('/manuals/getManuals')
      .query({ page: 0, sortOption: 'Nombre (A-Z)', searchTerm: 'Manual' });

    const manualId = getRes.body.manuals[0]._id;

    // Now fetch by that ID from the real database
    const res = await request(app).get('/manuals/getManuals').query({
      id: manualId,
      sortOption: 'Nombre (A-Z)',
      searchTerm: 'Manual',
    });

    expect(res.status).toBe(200);
    expect(res.body.manuals).toHaveLength(1);
    expect(res.body.manuals[0]._id).toBe(manualId);
    expect(res.body.manuals[0]).toHaveProperty('name');
    expect(res.body.manuals[0]).toHaveProperty('price');
  });

  test('GET /manuals/getManuals returns 404 when id does not exist', async () => {
    // Use a valid MongoDB ObjectId format that doesn't exist in the database
    const nonExistentId = '507f1f77bcf86cd799439011';

    const res = await request(app)
      .get('/manuals/getManuals')
      .query({ id: nonExistentId, sortOption: 'Nombre (A-Z)' });

    expect(res.status).toBe(404);
    expect(res.text).toContain('No manual found');
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
