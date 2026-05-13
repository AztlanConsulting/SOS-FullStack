import axiosInstance from '@/shared/utils/axios';
import type { PetInfoDetailed } from '../types/petCollection.types';

async function getFoundPetDetails(id: string): Promise<PetInfoDetailed> {
  const details = await axiosInstance.get(`found-pets/${id}`);

  if (details.status !== 200) throw Error("Couldn't fetch found-pet details");

  return details.data;
}

export default getFoundPetDetails;
