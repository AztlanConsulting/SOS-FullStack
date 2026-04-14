import type { PlanRepository } from '@domain/repositories/plan.repository';
import { PlanModel } from '@domain/models/plan.model';
import type { PlanResult } from '@domain/repositories/plan.repository';

export const PlanDataAccess: PlanRepository = {
  async getPlans(): Promise<PlanResult[]> {
    return await PlanModel.find();
  },
};
