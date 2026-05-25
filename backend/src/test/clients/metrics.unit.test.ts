import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { UserModel } from '@domain/models/user.model';
import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';

jest.mock('@domain/models/user.model');
jest.mock('@domain/models/purchasedPlan.model');

describe('Metrics Data Access (Unit Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Verifies getPlanDistribution groups plans by name
   */
  test('getPlanDistribution returns grouped plan data', async () => {
    const mockResult = [
      { name: 'Plan Básico', value: 3 },
      { name: 'Plan Estándar', value: 2 },
    ];
    (PurchasedPlanModel.aggregate as jest.Mock).mockResolvedValue(mockResult);

    const result = await purchasedPlanDataAccess.getPlanDistribution();

    expect(PurchasedPlanModel.aggregate).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Plan Básico');
    expect(result[0].value).toBe(3);
  });

  /**
   * Verifies getPlanDistribution returns empty array when no plans
   */
  test('getPlanDistribution returns empty array when no plans', async () => {
    (PurchasedPlanModel.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await purchasedPlanDataAccess.getPlanDistribution();

    expect(result).toHaveLength(0);
  });

  /**
   * Verifies getPlanDistribution throws when DB errors
   */
  test('getPlanDistribution throws on database error', async () => {
    (PurchasedPlanModel.aggregate as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    );

    await expect(purchasedPlanDataAccess.getPlanDistribution()).rejects.toThrow(
      'DB error',
    );
  });

  /**
   * Verifies getClientsByCountry returns country distribution
   */
  test('getClientsByCountry returns country distribution', async () => {
    const mockResult = [
      { name: 'México', value: 3 },
      { name: 'Colombia', value: 1 },
    ];
    (UserModel.aggregate as jest.Mock).mockResolvedValue(mockResult);

    const result = await userDataAccess.getClientsByCountry();

    expect(UserModel.aggregate).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('México');
    expect(result[0].value).toBe(3);
  });

  /**
   * Verifies getClientsByCountry returns empty array when no clients
   */
  test('getClientsByCountry returns empty array when no clients', async () => {
    (UserModel.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await userDataAccess.getClientsByCountry();

    expect(result).toHaveLength(0);
  });

  /**
   * Verifies getClientsByCountry throws on database error
   */
  test('getClientsByCountry throws on database error', async () => {
    (UserModel.aggregate as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(userDataAccess.getClientsByCountry()).rejects.toThrow(
      'DB error',
    );
  });
});
