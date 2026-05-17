import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
} from '@domain/models/purchasedPlan.model';

/**
 * Represents a statistical slice of purchased plans.
 * Used primarily for data visualization (e.g., Pie or Bar charts)
 * in the admin dashboard.
 */
export interface PlanDistributionMetric {
  name: string;
  value: number;
  color?: string;
}

export interface PurchasedPlanRepository {
  createPurchasedPlan(
    planData: PurchasedPlanCreateInput,
  ): Promise<PurchasedPlan>;
  getPlanDistribution(): Promise<PlanDistributionMetric[]>;
  getActivePlanByPetId(petId: string): Promise<PurchasedPlan | null>;
  activatePurchasedPlan(planId: string): Promise<boolean>;
}
