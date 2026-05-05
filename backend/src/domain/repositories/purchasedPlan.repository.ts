import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
  SocialPostsInput,
} from '@domain/models/purchasedPlan.model';

export interface PurchasedPlanRepository {
  createPurchasedPlan(
    planData: PurchasedPlanCreateInput,
  ): Promise<PurchasedPlan>;
  activatePurchasedPlan(planId: string): Promise<void>;
  updatePurchasedPlanSocialPosts(
    planId: string,
    data: SocialPostsInput,
  ): Promise<void>;
}
