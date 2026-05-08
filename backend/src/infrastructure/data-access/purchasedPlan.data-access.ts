import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';
import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
} from '@domain/models/purchasedPlan.model';
import type { PurchasedPlanRepository } from '@domain/repositories/purchasedPlan.repository';
import type { PlanDistributionMetric } from '@domain/repositories/purchasedPlan.repository';

export const purchasedPlanDataAccess: PurchasedPlanRepository = {
  /**
   * Creates a new purchased plan associated with a pet.
   *
   * @param planData - Data required to create the purchased plan (excluding id and timestamps)
   * @returns The created purchased plan as a plain JavaScript object
   */
  createPurchasedPlan: async function (
    planData: PurchasedPlanCreateInput,
  ): Promise<PurchasedPlan> {
    const newPlan = new PurchasedPlanModel(planData);
    const savedPlan = await newPlan.save();
    return savedPlan.toObject() as PurchasedPlan;
  },

  /**
   * Retrieves the distribution of purchased plans grouped by name.
   *
   * This implementation uses a MongoDB aggregation pipeline to count occurrences
   * of each plan name, providing data suitable for pie charts or bar graphs.
   *
   * Pipeline Stages:
   * 1. $group: Aggregates records by the 'name' field and counts the total ($sum: 1).
   * 2. $project: Reshapes the document to match the PlanDistributionMetric interface,
   *    renaming the internal '_id' to 'name' and suppressing the default ID.
   * 3. $sort: Orders the results from most to least popular.
   *
   * @returns {Promise<PlanDistributionMetric[]>} Array of metrics with plan names and total sales.
   */
  getPlanDistribution: async function (): Promise<PlanDistributionMetric[]> {
    const result = await PurchasedPlanModel.aggregate([
      {
        $group: {
          _id: '$name',
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
      { $sort: { value: -1 } },
    ]);

    return result;
  },
};
