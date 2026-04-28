import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';
import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
} from '@domain/models/purchasedPlan.model';
import type { PurchasedPlanRepository } from '@domain/repositories/purchasedPlan.repository';

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
};
