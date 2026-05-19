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

/**
 * PurchasedPlanRepository Interface
 * * Defines the storage contract for interacting with plan purchase records.
 * This boundary separates the high-level business logic from specific database
 * engines (MongoDB, PostgreSQL, Firebase, etc.).
 */
export interface PurchasedPlanRepository {
  /**
   * Persists a new plan purchase configuration.
   * Typically triggered after a successful billing gateway transaction.
   * * @param planData - The partial payload properties required to spin up a record.
   * @returns A promise resolving to the fully structured PurchasedPlan document.
   */
  createPurchasedPlan(
    planData: PurchasedPlanCreateInput,
  ): Promise<PurchasedPlan>;
  /**
   * Aggregates purchase history to compute the global popularity of different plans.
   * * @returns A promise resolving to an array of metrics structured for visualization tools.
   */
  getPlanDistribution(): Promise<PlanDistributionMetric[]>;
  /**
   * Evaluates the system for an active, ongoing subscription linked to a specific pet.
   * Crucial for validation gates, access tokens, or preventing duplicate coverage.
   * * @param petId - The unique system identifier for the domestic animal.
   * @returns The active plan document if found, or null if no valid plan is running.
   */
  getActivePlanByPetId(petId: string): Promise<PurchasedPlan | null>;
  /**
   * Flips a newly purchased or pending plan into an operative state, triggering
   * the beginning of its active countdown cycle.
   * * @param planId - The unique document identifier for the plan ledger.
   * @returns A boolean indicating if the activation sequence completed successfully.
   */
  activatePurchasedPlan(planId: string): Promise<boolean>;
  /**
   * Directly updates the underlying business lifecycle status flag of a plan
   * (e.g., 'pending', 'active', 'expired', 'canceled').
   * * @param planId - The unique document identifier for the plan ledger.
   * @param status - The targeted lifecycle string token to apply.
   */
  updatePlanStatus(planId: string, status: string): Promise<void>;
}
