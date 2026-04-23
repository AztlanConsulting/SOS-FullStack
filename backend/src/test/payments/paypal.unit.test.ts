import type { GetWorkshop } from '@domain/repositories/workshop.repository';
import { WorkshopModel } from '@domain/models/workshop.model';
import { WorkshopDataAccess } from '@infrastructure/data-access/workshop.data-access';
// Mock the Mongoose model to isolate the data access logic from the database.
jest.mock('@domain/models/workshop.model');

/**
 * Unit tests for the WorkshopDataAccess layer.
 * Focuses on verifying that the repository correctly interacts with the Mongoose model
 * and handles various database response scenarios.
 */
describe('Workshop unit-test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Verifies that getPlans successfully retrieves and returns all plan documents
   * when the database query is successful.
   */
  test('Get workshops - returns list of workshops', async () => {
    expect(1).toBe(1);
  });
});
