import { PlanDataAccess } from '@/interfaces/data-access/plan.data-access';
import { PlanModel } from '@/domain/models/plan.model';

jest.mock('@domain/models/plan.model');

describe('PlanDataAccess (Unit Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getPlans returns the list of the plans', async () => {
    const mockPlans = [
      { name: 'Básico', price: 390 },
      { name: 'Estandár', price: 840 },
      { name: 'Premium', price: 1600 },
    ];

    (PlanModel.find as jest.Mock).mockResolvedValue(mockPlans);
    const result = await PlanDataAccess.getPlans();

    expect(PlanModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPlans);
  });

  test('getPlans returns an empty array when there are no plans', async () => {
    (PlanModel.find as jest.Mock).mockResolvedValue([]);
    const result = await PlanDataAccess.getPlans();
    expect(result).toEqual([]);
  });

  test('getPlans throws an error when there is a database error', async () => {
    const mockError = new Error('Database error');
    (PlanModel.find as jest.Mock).mockRejectedValue(mockError);
    await expect(PlanDataAccess.getPlans()).rejects.toThrow('Database error');
  });
});
