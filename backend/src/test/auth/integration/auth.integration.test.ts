import type { Express } from 'express';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';

const mockSendPasswordResetEmail = jest.fn();
const PASSWORD_RESET_PUBLIC_MESSAGE =
  'Si existe el correo, se enviará un link. Revisa en las últimas entradas o en el spam. Si ya has intentado de recuperar tu contraseña, intenta más tarde.';

jest.mock('@interfaces/middleware/rateLimit.middleware', () => {
  const passThrough = (_req: unknown, _res: unknown, next: () => void) =>
    next();

  return {
    loginLimiter: passThrough,
    passwordResetLimiter: passThrough,
  };
});

jest.mock('@infrastructure/service/email.service', () => ({
  emailService: {
    sendActivatePlanEmail: jest.fn(),
    sendPasswordResetEmail: mockSendPasswordResetEmail,
  },
}));

import authRoutes from '@interfaces/routes/auth.routes';

import { connect, closeDatabase, clearDatabase } from '../../db';
import initAuthDB from '@infrastructure/database/mongoDB/data/auth.data';
import { PasswordResetTokenModel } from '@domain/models/passwordResetToken.model';
import { hashPasswordResetToken } from '@utils/passwordResetToken.utils';

describe('auth routes (integration)', () => {
  const originalFrontendUrl = process.env.FRONT_END_URL;

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
    process.env.FRONT_END_URL = 'https://frontend.test';
    mockSendPasswordResetEmail.mockReset();
    mockSendPasswordResetEmail.mockResolvedValue(undefined);
  });

  afterAll(async () => {
    // Close database connection after all tests
    await closeDatabase();
    process.env.FRONT_END_URL = originalFrontendUrl;
  });

  const requestResetLink = async (): Promise<string> => {
    const res = await request(app).post('/auth/forgot-password').send({
      email: 'test@test.com',
    });

    expect(res.status).toBe(200);
    expect(mockSendPasswordResetEmail).toHaveBeenCalledTimes(1);

    const emailPayload = mockSendPasswordResetEmail.mock.calls[0][0] as {
      resetUrl: string;
    };
    const token = new URL(emailPayload.resetUrl).searchParams.get('token');

    expect(token).toBeTruthy();

    return token as string;
  };

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

  // PASSWORD RECOVERY
  /**
   * Verifies that malformed emails are rejected before reset processing.
   */
  test('POST /auth/forgot-password returns 400 for invalid email', async () => {
    const res = await request(app).post('/auth/forgot-password').send({
      email: 'not-an-email',
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Correo invalido',
    });
    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies that unknown emails keep the endpoint response private.
   */
  test('POST /auth/forgot-password hides unknown emails and does not create tokens', async () => {
    const res = await request(app).post('/auth/forgot-password').send({
      email: 'missing@test.com',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: PASSWORD_RESET_PUBLIC_MESSAGE });
    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
    await expect(PasswordResetTokenModel.countDocuments()).resolves.toBe(0);
  });

  /**
   * Verifies that reset links are emailed once and stored only as hashes.
   */
  test('POST /auth/forgot-password sends one reset link and stores only the token hash', async () => {
    const token = await requestResetLink();
    const tokenRecord = await PasswordResetTokenModel.findOne({
      email: 'test@test.com',
    }).lean();

    expect(tokenRecord).toBeTruthy();
    expect(tokenRecord?.tokenHash).toBe(hashPasswordResetToken(token));
    expect(tokenRecord?.tokenHash).not.toBe(token);

    const emailPayload = mockSendPasswordResetEmail.mock.calls[0][0];
    expect(emailPayload).toEqual(
      expect.objectContaining({
        to: 'test@test.com',
        username: 'test',
        expiresInMinutes: 30,
      }),
    );
    expect(emailPayload.resetUrl).toContain(
      'https://frontend.test/recuperar-contrasena?token=',
    );
  });

  /**
   * Verifies the cooldown guard that prevents duplicate active reset links.
   */
  test('POST /auth/forgot-password does not send another link while one is active', async () => {
    await requestResetLink();
    mockSendPasswordResetEmail.mockClear();

    const res = await request(app).post('/auth/forgot-password').send({
      email: 'test@test.com',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: PASSWORD_RESET_PUBLIC_MESSAGE });
    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
    await expect(PasswordResetTokenModel.countDocuments()).resolves.toBe(1);
  });

  /**
   * Verifies that token validation accepts active tokens and rejects bad ones.
   */
  test('GET /auth/reset-password/validate validates usable reset tokens only', async () => {
    const token = await requestResetLink();

    const validRes = await request(app)
      .get('/auth/reset-password/validate')
      .query({ token });
    const invalidRes = await request(app)
      .get('/auth/reset-password/validate')
      .query({ token: 'invalid-token' });

    expect(validRes.status).toBe(200);
    expect(validRes.body).toEqual({ valid: true });
    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.valid).toBe(false);
  });

  /**
   * Verifies that weak reset passwords return detailed policy feedback.
   */
  test('POST /auth/reset-password rejects weak passwords with detailed feedback', async () => {
    const token = await requestResetLink();

    const res = await request(app).post('/auth/reset-password').send({
      token,
      newPassword: 'abc',
      confirmPassword: 'abc',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.message).toContain('al menos 12 caracteres');
    expect(res.body.message).toContain('una letra mayúscula');
    expect(res.body.message).toContain('un número');
    expect(res.body.message).toContain('un símbolo');

    const tokenRecord = await PasswordResetTokenModel.findOne({
      tokenHash: hashPasswordResetToken(token),
    }).lean();

    expect(tokenRecord?.usedAt).toBeNull();
  });

  /**
   * Verifies that password confirmation must match before updating.
   */
  test('POST /auth/reset-password rejects mismatched passwords', async () => {
    const token = await requestResetLink();

    const res = await request(app).post('/auth/reset-password').send({
      token,
      newPassword: 'Contraseña123!',
      confirmPassword: 'Contraseña123?',
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Las contraseñas no coinciden',
    });
  });

  /**
   * Verifies the full reset path and prevents token reuse afterward.
   */
  test('POST /auth/reset-password updates login credentials and consumes the token', async () => {
    const token = await requestResetLink();

    const resetRes = await request(app).post('/auth/reset-password').send({
      token,
      newPassword: 'Contraseña123!',
      confirmPassword: 'Contraseña123!',
    });
    const oldPasswordLogin = await request(app).post('/auth/login').send({
      email: 'test@test.com',
      password: '123456',
    });
    const newPasswordLogin = await request(app).post('/auth/login').send({
      email: 'test@test.com',
      password: 'Contraseña123!',
    });
    const reuseRes = await request(app).post('/auth/reset-password').send({
      token,
      newPassword: 'OtraContraseña123!',
      confirmPassword: 'OtraContraseña123!',
    });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.message).toBe('Contraseña cambiada correctamente');
    expect(oldPasswordLogin.status).toBe(401);
    expect(newPasswordLogin.status).toBe(200);
    expect(reuseRes.status).toBe(400);
    expect(reuseRes.body.error).toBe('RESET_TOKEN_INVALID');
  });
});
