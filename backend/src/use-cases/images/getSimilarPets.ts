import type {
  PetImage,
  PetImageDto,
} from '@domain/repositories/petImage.repository';

export default async function getSimilarPets(
  petVector: PetImage,
  page: number,
  petImage: PetImageDto,
) {
  const response = await petVector.getSimilarPets(petImage, page);

  return response;
}
