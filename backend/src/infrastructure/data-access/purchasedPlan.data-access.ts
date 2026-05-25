import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';
import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
  SocialPlatform,
  SocialPostsInput,
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
        $match: { status: { $nin: ['expirado', 'RIP', 'encontrado'] } },
      },
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

  /*
   * @param petId The pet id from the user.
   * @returns The plan for that pet.
   * Retrieves a purchased plan by its ID.
   *
   * @param planId - Unique identifier of the purchased plan
   * @returns The purchased plan if found, otherwise null
   */
  async getPurchasedPlanById(planId: string): Promise<PurchasedPlan | null> {
    const plan = await PurchasedPlanModel.findById(planId).lean();

    if (!plan) {
      return null;
    }

    return plan as PurchasedPlan;
  },

  async getActivePlansByPetId(petId: string): Promise<PurchasedPlan[] | null> {
    const plans = await PurchasedPlanModel.find({
      petId,
      active: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return plans as PurchasedPlan[];
  },

  /**
   * Activates a purchased plan.
   *
   * @param planId - Unique identifier of the purchased plan to activate
   */
  activatePurchasedPlan: async function (planId: string): Promise<void> {
    await PurchasedPlanModel.findByIdAndUpdate(
      planId,
      { $set: { active: true } },
      { runValidators: true },
    ).exec();
  },

  /**
   * Updates social media post information for a purchased plan.
   *
   * @param planId - Unique identifier of the purchased plan
   * @param data - Social platform post data to update
   */
  updatePurchasedPlanSocialPosts: async function (
    planId: string,
    data: SocialPostsInput,
  ): Promise<void> {
    const update: Record<string, unknown> = {};

    for (const platform of Object.keys(data) as SocialPlatform[]) {
      const value = data[platform];

      if (!value) continue;

      if (value.url !== undefined) {
        update[`socialPosts.${platform}.url`] = value.url;
      }

      if (value.status !== undefined) {
        update[`socialPosts.${platform}.status`] = value.status;
      }

      if (value.postedAt !== undefined) {
        update[`socialPosts.${platform}.postedAt`] = value.postedAt;
      }
    }

    if (Object.keys(update).length === 0) return;

    await PurchasedPlanModel.findByIdAndUpdate(
      planId,
      { $set: update },
      { runValidators: true },
    ).exec();
  },

  /**
   * Updates the email delivery status for a purchased plan.
   *
   * @param planId - Unique identifier of the purchased plan
   * @param status - Current email delivery status
   */
  updateEmailStatus: async function (
    planId: string,
    status: 'pending' | 'sent' | 'failed',
  ): Promise<void> {
    const update: Record<string, unknown> = {
      emailStatus: status,
    };

    if (status === 'sent') {
      update.emailSentAt = new Date();
    }

    await PurchasedPlanModel.findByIdAndUpdate(
      planId,
      { $set: update },
      { runValidators: true },
    ).exec();
  },

  /**
   * Directly updates the descriptive lifecycle tag of a specific plan record.
   * * @param planId - Document configuration tracking key.
   * @param status - The target validation state to persist (e.g., 'expirado').
   */
  updatePlanStatus: async (planId: string, status: string): Promise<void> => {
    await PurchasedPlanModel.findByIdAndUpdate(planId, { $set: { status } });
  },
};
