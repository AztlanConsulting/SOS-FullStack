import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
  SocialPostsInput,
} from '@domain/models/purchasedPlan.model';

export interface PurchasedPlanRepository {
  createPurchasedPlan(
    planData: PurchasedPlanCreateInput,
  ): Promise<PurchasedPlan>;
  getPurchasedPlanById(planId: string): Promise<PurchasedPlan | null>;
  activatePurchasedPlan(planId: string): Promise<void>;
  updatePurchasedPlanSocialPosts(
    planId: string,
    data: SocialPostsInput,
  ): Promise<void>;
  updateEmailStatus(
    planId: string,
    status: 'pending' | 'sent' | 'failed',
  ): Promise<void>;
}
