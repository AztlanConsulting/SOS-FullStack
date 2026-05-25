import type {
  PlanRepository,
  PlanResult,
} from '@/domain/repositories/plan.repository';

export default function getPlanByName(
  planRepository: PlanRepository,
  planName: string,
): Promise<PlanResult | null> {
  const plan = planRepository.getPlanByName(planName);

  return plan;
}
