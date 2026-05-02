import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
} from '@domain/models/purchasedPlan.model';

export interface PurchasedPlanRepository {
  createPurchasedPlan(
    planData: PurchasedPlanCreateInput,
  ): Promise<PurchasedPlan>;
  getActivePlanByPetId(petId: string): Promise<PurchasedPlan | null>;
}
