import express from 'express';
import request from 'supertest';
import metricsRoutes from '@interfaces/routes/metrics.routes';
import { connect, closeDatabase, clearDatabase } from '../db';
import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';
import { UserModel } from '@domain/models/user.model';
import { PetModel } from '@domain/models/pet.model';
import { RoleModel } from '@domain/models/role.model';
import bcrypt from 'bcryptjs';

describe('Metrics Routes (Integration)', () => {
  const app = express();
  app.use(express.json());
  app.use('/metrics', metricsRoutes);

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await clearDatabase();

    const role = await RoleModel.create({ role: 'CLIENT', permissions: [] });
    const hashedPassword = await bcrypt.hash('12345', 10);

    const user = await UserModel.create({
      username: 'María García',
      email: 'maria@test.com',
      password: hashedPassword,
      roleId: role._id,
      permissions: [],
      phone: '5512345678',
      active: true,
    });

    const pet = await PetModel.create({
      userId: user._id,
      name: 'Luna',
      species: 'dog',
      dateMissing: new Date(),
      sex: 'female',
      color: 'dorado',
      size: 'large',
      description: 'juguetona',
      photos: [],
      location: {
        coords: [-103.3496, 20.6597],
        displayName: 'Guadalajara, Jalisco, México',
        properties: {
          city: 'Guadalajara',
          country: 'México',
          state: 'Jalisco',
        },
      },
    });
    await PurchasedPlanModel.create({
      petId: pet._id,
      name: 'Plan Estándar',
      price: 19.99,
      duration: 30,
      radius: 20,
      features: ['búsqueda activa'],
      active: true,
      createdAt: new Date(),
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  /**
   * Verifies GET /metrics/plan-distribution returns 200 and array
   */
  test('GET /metrics/plan-distribution returns 200 and plan distribution', async () => {
    const res = await request(app).get('/metrics/plan-distribution');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('value');
  });

  /**
   * Verifies plan distribution groups by plan name correctly
   */
  test('GET /metrics/plan-distribution groups plans by name', async () => {
    const res = await request(app).get('/metrics/plan-distribution');
    const plan = res.body.find(
      (p: { name: string }) => p.name === 'Plan Estándar',
    );
    expect(plan).toBeDefined();
    expect(plan.value).toBe(1);
  });

  /**
   * Verifies GET /metrics/clients-by-country returns 200 and array
   */
  test('GET /metrics/clients-by-country returns 200 and country data', async () => {
    const res = await request(app).get('/metrics/clients-by-country');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * Verifies country distribution extracts country from location
   */
  test('GET /metrics/clients-by-country extracts country correctly', async () => {
    const res = await request(app).get('/metrics/clients-by-country');
    const mexico = res.body.find((c: { name: string }) => c.name === 'mexico');
    expect(mexico).toBeDefined();
    expect(mexico.value).toBe(1);
  });

  /**
   * Verifies clients without location are excluded from country distribution
   */
  test('GET /metrics/clients-by-country excludes clients without location', async () => {
    const role = await RoleModel.findOne({ role: 'CLIENT' });
    const user = await UserModel.create({
      username: 'Sin ubicación',
      email: 'sinubicacion@test.com',
      password: 'hashedPassword',
      roleId: role?._id,
      permissions: [],
      phone: '1234567890',
      active: true,
    });

    await PetModel.create({
      userId: user._id,
      name: 'Max',
      species: 'dog',
      dateMissing: new Date(),
      sex: 'male',
      color: 'negro',
      size: 'medium',
      description: 'sin ubicacion',
      photos: [],
      location: {
        coords: [-103.3496, 20.6597],
        displayName: 'Guadalajara, Jalisco, México',
        properties: {
          city: 'Guadalajara',
          country: 'México',
          state: 'Jalisco',
        },
      },
    });

    const res = await request(app).get('/metrics/clients-by-country');
    const sinUbicacion = res.body.find(
      (c: { name: string }) => c.name === undefined,
    );
    expect(sinUbicacion).toBeUndefined();
  });

  /**
   * Verifies response is JSON content-type
   */
  test('GET /metrics/plan-distribution replies with JSON content-type', async () => {
    const res = await request(app).get('/metrics/plan-distribution');
    expect(res.headers['content-type']).toMatch(/json/);
  });
});
