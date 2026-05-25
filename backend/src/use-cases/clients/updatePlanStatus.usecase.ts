import type { PurchasedPlanRepository } from '@/domain/repositories/purchasedPlan.repository';

/**
 * Dependencies required for the use case execution.
 * Injected automatically via the dependency injection container or controller layer.
 */
interface Deps {
  purchasedPlanRepository: PurchasedPlanRepository;
}

/**
 * * An Application Service responsible for modifying the operational status of a
 * customer's purchased subscription plan. This orchestrator sits within the core domain
 * layer, separating business rules from database implementation details.
 * * Common use cases include:
 * - Transitioning a plan to 'active' post-payment validation.
 * - Flagging a plan as 'expirado' via an automated cron-job worker.
 * - Setting a plan to 'cancelado' following a user-initiated request.
 * * @param dependencies - Destructured Repository object carrying database ports.
 * @param planId - The target unique identifier for the subscription ledger.
 * @param status - The new string state to apply (e.g., 'active', 'expirado', 'cancelado').
 * @returns {Promise<void>} Resolves when the persistence update successfully executes.
 */
export const updatePlanStatus = async (
  { purchasedPlanRepository }: Deps,
  planId: string,
  status: string,
): Promise<void> => {
  await purchasedPlanRepository.updatePlanStatus(planId, status);
};
