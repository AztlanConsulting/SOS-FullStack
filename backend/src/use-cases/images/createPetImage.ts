import type {
  PetImage,
  PetImageDto,
} from '@domain/repositories/petImage.repository';
import { PetImageResult } from '@domain/repositories/petImage.repository';

export async function createPetImage(
  petVector: PetImage,
  petImage: PetImageDto,
) {
  const response = await petVector.createPetImage(petImage);

  return response;
}
