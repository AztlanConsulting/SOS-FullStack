import type {
  PlanRepository,
  PlanResult,
} from '@domain/repositories/plan.repository';
import { PlanDataAccess } from '@interfaces/data-access/plan.data-access';

export const getPlansDB: PlanRepository = {
  async getPlans(): Promise<PlanResult[]> {
    return await PlanDataAccess.getPlans();
  },
};
