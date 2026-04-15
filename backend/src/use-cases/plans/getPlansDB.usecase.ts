import type { PlanRepository } from '@domain/repositories/plan.repository';

export const getPlansDB = (repository: PlanRepository): PlanRepository => ({
  getPlans: async () => {
    return await repository.getPlans();
  },
});
