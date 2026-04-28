import type { PurchasedPlanRepository } from '@/domain/repositories/purchasedPlan.repository';

export default async function activateLostPetReport(
  purchasedPlanRepository: PurchasedPlanRepository,
  planId: string,
) {
  return await purchasedPlanRepository.activatePurchasedPlan(planId);
}
