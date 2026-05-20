import type { PetRepository } from '@domain/repositories/pet.repository';
import type { PurchasedPlanRepository } from '@domain/repositories/purchasedPlan.repository';
import type { PlanProgressResult } from '../../types/clients.type';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

interface Dependencies {
  petRepository: PetRepository;
  purchasedPlanRepository: PurchasedPlanRepository;
}

export const getPlanProgress = async (
  { petRepository, purchasedPlanRepository }: Dependencies,
  userId: string,
): Promise<PlanProgressResult | null> => {
  const pets = await petRepository.getPetsByUserId(userId);
  if (pets.length === 0) {
    return null;
  }

  for (const pet of pets) {
    const plan = await purchasedPlanRepository.getActivePlanByPetId(
      pet._id.toString(),
    );

    if (!plan) {
      continue;
    }

    const elapsedDays = Math.max(
      Math.floor(
        (Date.now() - new Date(plan.createdAt).getTime()) / MS_PER_DAY,
      ),
      0,
    );

    return {
      planName: plan.name,
      totalDays: plan.duration,
      daysRemaining: Math.max(plan.duration - elapsedDays, 0),
      petName: pet.name,
      petImage: pet.photos[0] ?? null,
      posterImage: pet.photos[1] ?? null,
      dateMissing: pet.dateMissing,
      location: pet.location.displayName,
    };
  }

  return null;
};
