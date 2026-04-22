import type { Express } from 'express';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';

import authRoutes from '@interfaces/routes/auth.routes';

import { connect, closeDatabase, clearDatabase } from '../../db';
import initAuthDB from '@infrastructure/database/mongoDB/data/auth.data';

describe('auth routes (integration)', () => {
  // Express application instance used for testing
  const app: Express = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRoutes);

  beforeAll(async () => {
    // Connect to in-memory database before running tests
    await connect();
  });

  beforeEach(async () => {
    // Reset database state before each test
    await clearDatabase();
    await initAuthDB();
  });

  afterAll(async () => {
    // Close database connection after all tests
    await closeDatabase();
  });

  // LOGIN
  test('POST /auth/login returns user and accessToken', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@test.com',
      password: '123456',
      remember: true,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('accessToken');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('POST /auth/login returns 401 with invalid credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@test.com',
      password: 'wrong',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  test('POST /auth/login returns 400 when missing fields', async () => {
    const res = await request(app).post('/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  // REFRESH
  test('POST /auth/refresh returns new accessToken', async () => {
    // Create a persistent agent to keep cookies
    const agent = request.agent(app);

    await agent.post('/auth/login').send({
      email: 'test@test.com',
      password: '123456',
      remember: true,
    });

    const res = await agent.post('/auth/refresh');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('POST /auth/refresh returns 401 without cookie', async () => {
    const agent = request.agent(app);

    const res = await agent.post('/auth/refresh');

    expect(res.status).toBe(401);
  });

  // ME
  test('GET /auth/me returns user when authenticated', async () => {
    const agent = request.agent(app);

    const loginRes = await agent.post('/auth/login').send({
      email: 'test@test.com',
      password: '123456',
      remember: true,
    });

    const token: string = loginRes.body.accessToken;

    const res = await agent
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
  });

  test('GET /auth/me returns 401 without token', async () => {
    const res = await request(app).get('/auth/me');

    expect(res.status).toBe(401);
  });

  // LOGOUT
  test('POST /auth/logout clears session', async () => {
    const agent = request.agent(app);

    await agent.post('/auth/login').send({
      email: 'test@test.com',
      password: '123456',
      remember: true,
    });

    const res = await agent.post('/auth/logout');

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Sesion cerrada');
  });
});
