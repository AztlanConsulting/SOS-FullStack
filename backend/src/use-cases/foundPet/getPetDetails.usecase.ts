import type {
  GetPetRepositories,
  PetInfoDetailed,
} from '@/types/foundPet.types';

async function getPetDetails(
  { foundPetRepository, petVector }: GetPetRepositories,
  id: string,
): Promise<PetInfoDetailed> {
  const dbPetDetails = await foundPetRepository.getFoundPetById(id);

  if (dbPetDetails === undefined)
    throw Error('Could not find pet by ID in collection DB');

  const vectorPet = await petVector.getPetById(id);

  if (vectorPet === undefined)
    throw Error('Could not find pet by ID in vector DB');

  const image = 'image'; //vectorPet!.image.toString();

  // TODO: Pending, missing integration with location interface change
  const location = dbPetDetails!.location!;
  const petInfo = dbPetDetails!;

  const petDetails: PetInfoDetailed = {
    image,
    refId: id,
    location: location,
    details: petInfo.description ?? '',
    date: petInfo.date,
    breed: petInfo.breed ?? 'Indefinido',
    species: petInfo.species,
    sex: petInfo.sex,
    color: petInfo.color,
    size: petInfo.size,
    contactName: petInfo.contactName,
    phoneNumber: petInfo.phoneNumber,
    email: petInfo.email,
  };
  return petDetails;
}

export default getPetDetails;
