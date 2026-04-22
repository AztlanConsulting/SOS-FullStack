import express from 'express';
import request from 'supertest';
import planRoutes from '@interfaces/routes/plans.routes';
import { connect, closeDatabase, clearDatabase } from '../db';
import initPlanDB from '@infrastructure/database/mongoDB/data/plans.data';

describe('plans routes (integration)', () => {
  const app = express();
  app.use('/plans', planRoutes);

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await clearDatabase();
    await initPlanDB();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  /**
   * Confirms that a successful database query results in a 200 OK status
   * and returns the seeded plans from the real in-memory MongoDB.
   */
  test('GET /plans/getPlans replies with 200 and the list of plans', async () => {
    const res = await request(app).get('/plans/getPlans');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // initPlanDB inserts 3 plans
    expect(res.body).toHaveLength(3);
  });

  /**
   * Validates the schema of each returned plan matches the expected contract.
   */
  test('GET /plans/getPlans — each plan has a name (string) and price (number)', async () => {
    const res = await request(app).get('/plans/getPlans');

    expect(res.status).toBe(200);
    res.body.forEach((plan: { name: string; price: number }) => {
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('price');
      expect(typeof plan.name).toBe('string');
      expect(typeof plan.price).toBe('number');
    });
  });

  /**
   * Verifies the response contains the exact plans inserted by the seed function.
   */
  test('GET /plans/getPlans — returns the correct plan names and prices', async () => {
    const res = await request(app).get('/plans/getPlans');

    const names = res.body.map((p: { name: string }) => p.name);
    const prices = res.body.map((p: { price: number }) => p.price);

    expect(names).toContain('Básico');
    expect(names).toContain('Estándar');
    expect(names).toContain('Premium');
    expect(prices).toContain(390);
    expect(prices).toContain(840);
    expect(prices).toContain(1600);
  });

  /**
   * Ensures the response headers correctly specify JSON content-type.
   */
  test('GET /plans/getPlans — replies with JSON content-type', async () => {
    const res = await request(app).get('/plans/getPlans');

    expect(res.headers['content-type']).toMatch(/json/);
  });
});
