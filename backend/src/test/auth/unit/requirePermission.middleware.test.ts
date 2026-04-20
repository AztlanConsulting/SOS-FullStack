import { requirePermission } from '@interfaces/middleware/auth.middleware';
import { getUserPermissions } from '@use-cases/auth/getUserPermissions.usecase';
import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

jest.mock('@use-cases/auth/getUserPermissions.usecase');

describe('requirePermission middleware (unit)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Mock request with authenticated user (valid TokenPayload shape)
    req = {
      user: {
        userId: new Types.ObjectId(),
        email: 'test@test.com',
        role: 'admin',
      },
    };

    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock next middleware function
    next = jest.fn();

    jest.clearAllMocks();
  });

  test('returns 401 if no user in request', async () => {
    // Simulate missing authenticated user
    req.user = undefined;

    const middleware = requirePermission('users', 'read');

    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows access if permission exists', async () => {
    // Mock granted permissions
    (getUserPermissions as jest.Mock).mockResolvedValue({
      users: {
        read: true,
        create: false,
        update: false,
        delete: false,
      },
    });

    const middleware = requirePermission('users', 'read');

    await middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  test('returns 403 if permission denied', async () => {
    // Mock denied permissions
    (getUserPermissions as jest.Mock).mockResolvedValue({
      users: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    });

    const middleware = requirePermission('users', 'read');

    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 500 if error occurs', async () => {
    // Simulate service failure
    (getUserPermissions as jest.Mock).mockRejectedValue(new Error('DB error'));

    const middleware = requirePermission('users', 'read');

    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
