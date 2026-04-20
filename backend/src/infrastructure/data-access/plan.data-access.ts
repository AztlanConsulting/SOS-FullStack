import type { PlanRepository } from '@domain/repositories/plan.repository';
import { PlanModel } from '@domain/models/plan.model';
import type { PlanResult } from '@domain/repositories/plan.repository';

/**
 * Concrete implementation of the PlanRepository interface using Mongoose.
 * This data access object handles direct interactions with the MongoDB collection.
 */
export const PlanDataAccess: PlanRepository = {
  /**
   * Queries the database to retrieve all plan documents.
   * Maps the MongoDB collection results to the PlanResult interface.
   * @returns A promise resolving to an array of plan records.
   */
  async getPlans(): Promise<PlanResult[]> {
    return await PlanModel.find();
  },
};
