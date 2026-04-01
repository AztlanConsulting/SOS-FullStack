import type {
  PetImage,
  PetImageDto,
  PetImages,
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

  getSimilarPets: async function (
    petImageDto: PetImageDto,
    offset: number,
  ): Promise<PetImages[]> {
    const image = petImageDto.image.toString('base64');
    const resImg = await vectorDB.graphql
      .get()
      .withClassName('Pet')
      .withFields('image')
      .withNearImage({ image: image })
      .withOffset(offset)
      .withLimit(10)
      .do();

    const result = resImg.data.Get.Pet;
    console.log(result);

    return [{ refId: '123', image: Buffer.from('hola que hace') }];
  },
};
