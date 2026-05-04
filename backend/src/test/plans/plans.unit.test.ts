import { PlanDataAccess } from '@infrastructure/data-access/plan.data-access';
import { PlanModel } from '@/domain/models/plan.model';
// Mock the Mongoose model to isolate the data access logic from the database.
jest.mock('@domain/models/plan.model');

/**
 * Unit tests for the PlanDataAccess layer.
 * Focuses on verifying that the repository correctly interacts with the Mongoose model
 * and handles various database response scenarios.
 */
describe('PlanDataAccess (Unit Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Verifies that getPlans successfully retrieves and returns all plan documents
   * when the database query is successful.
   */
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

  /**
   * Ensures the repository returns an empty array rather than null or undefined
   * when no records exist in the collection.
   */
  test('getPlans returns an empty array when there are no plans', async () => {
    (PlanModel.find as jest.Mock).mockResolvedValue([]);
    const result = await PlanDataAccess.getPlans();
    expect(result).toEqual([]);
  });

  /**
   * Validates error propagation by ensuring that database-level exceptions
   * are correctly thrown upwards through the repository.
   */
  test('getPlans throws an error when there is a database error', async () => {
    const mockError = new Error('Database error');
    (PlanModel.find as jest.Mock).mockRejectedValue(mockError);
    await expect(PlanDataAccess.getPlans()).rejects.toThrow('Database error');
  });
});
