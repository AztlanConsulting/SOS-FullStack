import type {
  PetImageSearch,
  PetVectorRepository,
} from '@/domain/repositories/petImage.repository';

async function countPetImages(
  petVector: PetVectorRepository,
  petImage: PetImageSearch,
): Promise<number> {
  const total = await petVector.countPetImages(petImage);

  return total;
}

export default countPetImages;
