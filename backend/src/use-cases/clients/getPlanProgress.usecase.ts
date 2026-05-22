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
): Promise<PlanProgressResult[] | null> => {
  const pets = await petRepository.getPetsByUserId(userId);
  if (pets.length === 0) {
    return null;
  }

  const planProgress: PlanProgressResult[] = [];

  for (const pet of pets) {
    const plans = await purchasedPlanRepository.getActivePlansByPetId(
      pet._id.toString(),
    );

    if (!plans || plans.length === 0) {
      continue;
    }

    const posterImage =
      pet.photos.length > 1 ? (pet.photos.at(-1) ?? null) : null;

    planProgress.push({
      plans: plans.map((p) => ({
        name: p.name,
        duration: p.duration,
        createdAt: p.createdAt,
      })),
      petName: pet.name,
      petImage: pet.photos[0] ?? null,
      posterImage,
      dateMissing: pet.dateMissing,
      location: pet.location.displayName,
    });
  }

  return planProgress;
};
