import request from 'supertest';
import app from '@/index';
import { PlanModel } from '@/domain/models/plan.model';

// Mock the Mongoose model to simulate database behavior without a real connection.
jest.mock('@domain/models/plan.model');

/**
 * Integration tests for the Plan retrieval endpoint.
 * Validates the full request-response cycle from the Express router
 * through the controller and use case layers.
 */
describe(' GET /plans/getPlans (Integration Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Confirms that a successful database query results in a 200 OK status
   * and the expected plan data in the response body.
   */
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

  /**
   * Checks that the API returns an empty array and a 200 status
   * when the collection contains no plans.
   */
  test('replies with an empry array when there are no plans', async () => {
    (PlanModel.find as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/plans/getPlans');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  /**
   * Verifies that database failures are caught by the controller
   * and result in a 500 Internal Server Error with an error message.
   */
  test('replies with 500 when there is a database error', async () => {
    const mockError = new Error('Database error');
    (PlanModel.find as jest.Mock).mockRejectedValue(mockError);
    const res = await request(app).get('/plans/getPlans');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  /**
   * Ensures the response headers correctly specify JSON content-type.
   */
  test('replies with a JSON object', async () => {
    (PlanModel.find as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/plans/getPlans');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  /**
   * Validates the schema of the returned objects to ensure they
   * match the expected contract (name and price properties with correct types).
   */
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
