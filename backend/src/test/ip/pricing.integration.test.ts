import { clearDatabase, closeDatabase, mongoDB } from '@db/mongoDB/mongoDB';
import app from '@/index';
import request from 'supertest';
import { initPriceDB } from '@db/mongoDB/data/pricing.data';

describe('pricing routes (integration)', () => {
  beforeAll(async () => {
    await mongoDB('test');
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  /**
   * SUCCESS CASE
   * Verifies /pricing returns correct structure for all resources.
   */
  it('GET /pricing returns localized prices for all resources', async () => {
    await initPriceDB();

    const res = await request(app).get('/pricing');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('plans');
    expect(res.body).toHaveProperty('manuals');
    expect(res.body).toHaveProperty('workshops');
    expect(res.body).toHaveProperty('currencyCode');
    expect(res.body.plans).toHaveLength(3);
    expect(res.body.manuals).toHaveLength(2);
    expect(res.body.workshops).toHaveLength(1);
  });

  /**
   * CORRECT RESPONSE SHAPE
   * Verifies each plan has the correct localized pricing fields.
   */
  it('GET /pricing returns correct shape for each plan', async () => {
    await initPriceDB();

    const res = await request(app).get('/pricing');

    expect(res.body.plans[0]).toMatchObject({
      name: expect.any(String),
      originalPrice: expect.any(Number),
      localizedPrice: expect.any(Number),
      currencyCode: expect.any(String),
      exchangeRate: expect.any(Number),
    });
  });

  /**
   * PRICE CONVERSION
   * Verifies localizedPrice is originalPrice * exchangeRate.
   */
  it('GET /pricing localizedPrice equals originalPrice * exchangeRate', async () => {
    await initPriceDB();

    const res = await request(app).get('/pricing');

    for (const plan of res.body.plans) {
      const expected =
        Math.round(plan.originalPrice * plan.exchangeRate * 100) / 100;
      expect(plan.localizedPrice).toBe(expected);
    }
  });

  /**
   * EMPTY DATABASE
   * Verifies /pricing returns empty arrays when no data exists.
   */
  it('GET /pricing returns empty arrays when DB has no data', async () => {
    const res = await request(app).get('/pricing');

    expect(res.status).toBe(200);
    expect(res.body.plans).toEqual([]);
    expect(res.body.manuals).toEqual([]);
    expect(res.body.workshops).toEqual([]);
  });

  /**
   * FALLBACK BEHAVIOR
   * Verifies exchangeRate is always a valid number >= 1.
   */
  it('GET /pricing always returns a valid exchange rate', async () => {
    await initPriceDB();

    const res = await request(app).get('/pricing');

    expect(res.body.plans[0].exchangeRate).toBeGreaterThanOrEqual(1);
  });
});
