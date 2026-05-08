import type {
  PlanDistributionMetric,
  PurchasedPlanRepository,
} from '@/domain/repositories/purchasedPlan.repository';

/**
 * Dependencies required for the use case.
 * We inject the repository to maintain high testability and
 * decoupling from the database implementation.
 */
interface Deps {
  purchasedPlanRepository: PurchasedPlanRepository;
}

/**
 * getPlanDistributionUseCase
 *
 * An Application Service (Use Case) that coordinates the retrieval of
 * plan distribution data. This logic is used by the admin dashboard
 * to generate business intelligence visualizations.
 *
 * Business Logic:
 * - Fetches an aggregated count of all purchased plans grouped by their type/name.
 * - Provides the data layer required for Pie, Donut, or Bar charts.
 *
 * @param {Deps} deps - Injected repository dependencies.
 * @returns {Promise<PlanDistributionMetric[]>} A list of metrics containing plan names and purchase counts.
 */
export const getPlanDistributionUseCase = ({
  purchasedPlanRepository,
}: Deps): Promise<PlanDistributionMetric[]> => {
  return purchasedPlanRepository.getPlanDistribution();
};
