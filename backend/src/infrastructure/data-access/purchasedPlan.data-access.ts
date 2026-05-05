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
   * Activates a purchased plan.
   */
  activatePurchasedPlan: async function (planId: string): Promise<void> {
    await PurchasedPlanModel.findByIdAndUpdate(
      planId,
      { $set: { active: true } },
      { runValidators: true },
    ).exec();
  },

  /**
   * Updates social posts (facebook / instagram / future platforms).
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
};
