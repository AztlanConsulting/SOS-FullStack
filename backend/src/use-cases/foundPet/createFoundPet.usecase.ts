import type { FoundPetReport } from '@domain/models/foundPet.model';
import type {
  FoundPetRepository,
  FoundPetResult,
} from '@domain/repositories/foundPet.repository';

export const createFoundPet = async (
  foundPetRepository: FoundPetRepository,
  data: FoundPetReport,
): Promise<FoundPetResult> => {
  return await foundPetRepository.createFoundPet(data);
};
