import type { PetRepository } from '@domain/repositories/pet.repository';
import type { PurchasedPlanRepository } from '@domain/repositories/purchasedPlan.repository';
import type { PlanProgressResult } from '../../types/clients.type';

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

  const petImage = pet.photos.length > 0 ? pet.photos[0] : null;
  const posterImage =
    pet.photos.length > 1 ? pet.photos[pet.photos.length - 1] : null;

  const location = pet.location?.displayName ?? '';

  return {
    planName: plan.name,
    totalDays,
    daysRemaining,
    petName: pet.name,
    petImage,
    posterImage,
    dateMissing: pet.dateMissing,
    location,
  };
};
