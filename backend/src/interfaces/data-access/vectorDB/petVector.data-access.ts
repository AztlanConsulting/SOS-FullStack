import type {
  PetImage,
  PetImageDto,
} from '@domain/repositories/petImage.repository';
import { PetImageResult } from '@domain/repositories/petImage.repository';
import vectorDB from '@infrastructure/database/vectorDB/vectorDatabase';

export const petVector: PetImage = {
  createPetImage: async function (petImage: PetImageDto) {
    const b64 = petImage.image.toString('base64');

    const result = await vectorDB.data
      .creator()
      .withClassName('Pet')
      .withProperties({
        refId: petImage.refId,
        image: b64,
        species: petImage.species,
      })
      .do();

    if (!result) return { status: false };

    return { status: true };
  },
};
