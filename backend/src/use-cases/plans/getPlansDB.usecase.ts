import type {
  PlanRepository,
  PlanResult,
} from '@domain/repositories/plan.repository';

/**
 * Service factory that wraps a PlanRepository to provide plan retrieval logic.
 * This pattern allows for dependency injection and decoupling of the business logic from the specific data source.
 * @param repository - An implementation of the PlanRepository interface.
 * @returns A PlanRepository implementation that delegates calls to the provided repository.
 */
export async function getPlansDB(
  repository: PlanRepository,
): Promise<PlanResult[]> {
  return await repository.getPlans();
}
