import { authMiddleware } from '@interfaces/middleware/auth.middleware';
import { verifyAccessToken } from '@utils/jwt.utils';
import { getUserById } from '@use-cases/auth/getUser.usecase';
import type { Request, Response, NextFunction } from 'express';

jest.mock('@utils/jwt.utils');
jest.mock('@use-cases/auth/getUser.usecase');

describe('authMiddleware (unit)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Mock request object with headers only
    req = {
      headers: {},
    };

    // Mock response object with chainable status method
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock next function
    next = jest.fn();

    jest.clearAllMocks();
  });

  test('returns 401 if no Authorization header', async () => {
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 if malformed token', async () => {
    // Simulate invalid Authorization header format
    req.headers = { authorization: 'InvalidHeader' };

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next and attaches user when token is valid', async () => {
    // Simulate valid Bearer token
    req.headers = { authorization: 'Bearer valid-token' };

    // Mock decoded token payload
    (verifyAccessToken as jest.Mock).mockReturnValue({
      userId: 'user-id',
      email: 'test@test.com',
      role: 'admin',
    });

    // Mock existing active user
    (getUserById as jest.Mock).mockResolvedValue({
      _id: 'user-id',
      active: true,
    });

    await authMiddleware(req as Request, res as Response, next);

    expect(verifyAccessToken).toHaveBeenCalledWith('valid-token');
    expect((req as Request).user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  test('returns 401 if user does not exist', async () => {
    req.headers = { authorization: 'Bearer valid-token' };

    // Mock decoded token with minimal payload
    (verifyAccessToken as jest.Mock).mockReturnValue({
      userId: 'user-id',
    });

    // Simulate user not found
    (getUserById as jest.Mock).mockResolvedValue(null);

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns TOKEN_EXPIRED if token expired', async () => {
    req.headers = { authorization: 'Bearer expired-token' };

    // Simulate expired token error
    (verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error('TOKEN_EXPIRED');
    });

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'TOKEN_EXPIRED',
      }),
    );
  });

  test('returns INVALID_TOKEN for invalid token', async () => {
    req.headers = { authorization: 'Bearer bad-token' };

    // Simulate invalid token error
    (verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error('TOKEN_INVALID');
    });

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'INVALID_TOKEN',
      }),
    );
  });
});
