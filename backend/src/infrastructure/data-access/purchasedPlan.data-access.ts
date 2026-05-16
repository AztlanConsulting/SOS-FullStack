import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';
import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
  SocialPlatform,
  SocialPostsInput,
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

  /**
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
};
