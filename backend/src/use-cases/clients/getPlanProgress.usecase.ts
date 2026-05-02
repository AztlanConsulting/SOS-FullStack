import type { PetRepository } from '@domain/repositories/pet.repository';
import type { PurchasedPlanRepository } from '@domain/repositories/purchasedPlan.repository';

interface PlanProgressResult {
  planName: string;
  totalDays: number;
  daysRemaining: number;
}

interface Dependencies {
  petRepository: PetRepository;
  purchasedPlanRepository: PurchasedPlanRepository;
}

export const getPlanProgress = async (
  { petRepository, purchasedPlanRepository }: Dependencies,
  userId: string,
): Promise<PlanProgressResult | null> => {
  const pet = await petRepository.getPetByUserId(userId);
  if (!pet) {
    return null;
  }

  const plan = await purchasedPlanRepository.getActivePlanByPetId(
    pet._id.toString(),
  );
  if (!plan) {
    return null;
  }

  const totalDays = plan.duration;
  const createdAt = new Date(plan.createdAt);
  const today = new Date();

  const diffTime = today.getTime() - createdAt.getTime();

  const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  return {
    planName: plan.name,
    totalDays,
    daysRemaining,
  };
};
