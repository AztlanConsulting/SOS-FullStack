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
  const pets = await petRepository.getPetsByUserId(userId);
  if (pets.length === 0) {
    return null;
  }

  const plan = await purchasedPlanRepository.getPurchasedPlanById(
    pet._id.toString(),
  );
  if (!plan) {
    return null;
  }

  return null;
};
