import express from 'express';
import request from 'supertest';
import clientRoutes from '@interfaces/routes/client.routes';
import { connect, closeDatabase, clearDatabase } from '../db';
import { RoleModel } from '@domain/models/role.model';
import { UserModel } from '@domain/models/user.model';
import { PetModel } from '@domain/models/pet.model';
import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

describe('Client Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/clientes', clientRoutes);

  let userId: Types.ObjectId;

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await clearDatabase();
    const role = await RoleModel.create({ role: 'CLIENT', permissions: [] });
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await UserModel.create({
      username: 'Sebastian',
      email: 'sebastian@example.com',
      password: hashedPassword,
      roleId: role._id,
      permissions: [],
      phone: '1234567890',
      conversation: 'sos.com',
      active: true,
    });
    userId = user._id;

    const pet = await PetModel.create({
      userId: user._id,
      name: 'Pookie',
      species: 'dog',
      dateMissing: new Date('2024-01-15'),
      breed: 'Labrador',
      sex: 'male',
      color: 'yellow',
      size: 'large',
      description: 'ojos grandes',
      photos: [],
      placeMissing: 'Querétaro',
    });

    await PurchasedPlanModel.create({
      petId: pet._id,
      name: 'Plan Básico',
      price: 9.99,
      duration: 30,
      radius: 10,
      features: ['búsqueda activa'],
      active: true,
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  /**
   * Verifies GET /api/clients returns 200 and a list of clients
   */
  test('GET /api/clientes replies with 200 and list of clients', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('clients');
    expect(Array.isArray(res.body.clients)).toBe(true);
    expect(res.body.clients.length).toBeGreaterThan(0);
  });

  /**
   * Verifies pagination fields are present in the response
   */
  test('GET /api/clientes returns pagination fields', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('totalPages');
  });

  /**
   * Verifies search filters clients by username
   */
  test('GET /api/clientes?search=Sebastian returns matching client', async () => {
    const res = await request(app).get('/api/clientes?search=Sebastian');
    expect(res.status).toBe(200);
    expect(res.body.clients[0].username).toBe('Sebastian');
  });

  /**
   * Verifies search returns empty when no match
   */
  test('GET /api/clientes?search=nonexistent returns empty list', async () => {
    const res = await request(app).get('/api/clientes?search=nonexistent');
    expect(res.status).toBe(200);
    expect(res.body.clients).toHaveLength(0);
  });

  /**
   * Verifies client has pet and plan populated
   */
  test('GET /api/clientes — client has pet and plan populated', async () => {
    const res = await request(app).get('/api/clientes');
    const client = res.body.clients.find(
      (c: { username: string }) => c.username === 'Sebastian',
    );
    expect(client).toHaveProperty('pet');
    expect(client.pet.name).toBe('Pookie');
    expect(client).toHaveProperty('plan');
    expect(client.plan?.active).toBe(true);
  });

  /**
   * Verifies GET /api/clients/:id returns full client detail
   */
  test('GET /api/clientes/:id returns full client detail', async () => {
    const res = await request(app).get(`/api/clientes/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('Sebastian');
    expect(Array.isArray(res.body.pets)).toBe(true);
    expect(Array.isArray(res.body.plans)).toBe(true);
  });

  /**
   * Verifies GET /api/clients/:id returns 404 for unknown id
   */
  test('GET /api/clientes/:id returns 404 for unknown id', async () => {
    const res = await request(app).get(`/api/clientes/${new Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });

  /**
   * Verifies PUT /api/clients/:id updates conversation link
   */
  test('PUT /api/clientes/:id updates conversation link', async () => {
    const res = await request(app)
      .put(`/api/clientes/${userId}`)
      .send({ conversation: 'https://updated.com' });

    expect(res.status).toBe(200);

    const updated = await request(app).get(`/api/clientes/${userId}`);
    expect(updated.body.conversation).toBe('https://updated.com');
  });

  /**
   * Verifies response is JSON content-type
   */
  test('GET /api/clientes replies with JSON content-type', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.headers['content-type']).toMatch(/json/);
  });
});
