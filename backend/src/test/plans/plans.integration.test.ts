import request from 'supertest';
import app from '@/index';
import { PlanModel } from '@/domain/models/plan.model';

jest.mock('@domain/models/plan.model');

describe(' GET /plans/getPlans (Integration Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('replies with 200 and the list of the plans', async () => {
    const mockPlans = [
      { name: 'Básico', price: 390 },
      { name: 'Estandár', price: 840 },
      { name: 'Premium', price: 1600 },
    ];

    (PlanModel.find as jest.Mock).mockResolvedValue(mockPlans);
    const res = await request(app).get('/plans/getPlans');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPlans);
  });

  test('replies with an empry array when there are no plans', async () => {
    (PlanModel.find as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/plans/getPlans');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('replies with 500 when there is a database error', async () => {
    const mockError = new Error('Database error');
    (PlanModel.find as jest.Mock).mockRejectedValue(mockError);
    const res = await request(app).get('/plans/getPlans');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('replies with a JSON object', async () => {
    (PlanModel.find as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/plans/getPlans');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  test('Each plan has a name and a price', async () => {
    const mockPlans = [
      { name: 'Básico', price: 390 },
      { name: 'Estandár', price: 840 },
    ];
    (PlanModel.find as jest.Mock).mockResolvedValue(mockPlans);
    const res = await request(app).get('/plans/getPlans');

    res.body.forEach((plan: { name: string; price: number }) => {
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('price');
      expect(typeof plan.name).toBe('string');
      expect(typeof plan.price).toBe('number');
    });
  });
});
