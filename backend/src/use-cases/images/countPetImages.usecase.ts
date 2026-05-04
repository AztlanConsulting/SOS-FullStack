import type {
  PetImageDto,
  PetVectorRepository,
} from '@/domain/repositories/petImage.repository';

async function countPetImages(
  petVector: PetVectorRepository,
  petImage: PetImageDto,
): Promise<number> {
  const total = await petVector.countPetImages(petImage);

  return total;
}

export default countPetImages;
