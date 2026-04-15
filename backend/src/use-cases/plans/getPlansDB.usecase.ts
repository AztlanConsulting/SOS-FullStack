import type { PlanRepository } from '@domain/repositories/plan.repository';

/**
 * Service factory that wraps a PlanRepository to provide plan retrieval logic.
 * This pattern allows for dependency injection and decoupling of the business logic from the specific data source.
 * @param repository - An implementation of the PlanRepository interface.
 * @returns A PlanRepository implementation that delegates calls to the provided repository.
 */
export const getPlansDB = (repository: PlanRepository): PlanRepository => ({
  /**
   * Fetches the list of plans from the underlying repository.
   * @returns A promise that resolves to an array of plan results.
   */
  getPlans: async () => {
    return await repository.getPlans();
  },
});
