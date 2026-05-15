import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('@/use-cases/clients/getPlanProgress.usecase', () => ({
  getPlanProgress: jest.fn(),
}));

jest.mock('@/use-cases/clients/getPurchasedResources.usecase', () => ({
  getPurchasedResources: jest.fn(),
}));

import { getDashboardController } from '@/interfaces/controllers/clients.controller';
import { getPlanProgress } from '@/use-cases/clients/getPlanProgress.usecase';
import { getPurchasedResources } from '@/use-cases/clients/getPurchasedResources.usecase';

describe('getDashboardController', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 si faltan credenciales', async () => {
    const req = { user: { userId: null, email: '' } } as any;

    await getDashboardController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('retorna el dashboard cuando todo está bien', async () => {
    (getPlanProgress as jest.Mock).mockResolvedValue({ petName: 'Firulais' });
    (getPurchasedResources as jest.Mock).mockResolvedValue([]);

    const req = { user: { userId: 'u1', email: 'user@test.com' } } as any;

    await getDashboardController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        planProgress: { petName: 'Firulais' },
        resources: [],
      }),
    );
  });
});
