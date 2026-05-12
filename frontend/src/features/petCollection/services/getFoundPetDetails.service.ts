import axiosInstance from '@/shared/utils/axios';
import type { PetInfoDetailed } from '../types/petCollection.types';
import tempImage from '@/assets/images/husky3.jpg';

async function getFoundPetDetails(id: string): Promise<PetInfoDetailed> {
  const details = await axiosInstance.get(`/found-pets/${id}`);

  if (details.status !== 200) throw Error("Couldn't fetch found-pet details");

  return details.data;
}

async function tempFoundPetDetails(id: string): Promise<PetInfoDetailed> {
  const petDetails: PetInfoDetailed = {
    refId: id,
    species: 'Dog',
    breed: 'Huskey',
    date: new Date().toISOString(),
    sex: 'Macho',
    color: 'Blanco y negro',
    size: 'Mini: 1 a 4 kg',
    image: tempImage,
    location: 'Querétaro México',
    contactName: 'Juan Caballero',
    phoneNumber: '+52 555 555 5555',
    email: 'PowerRanger Rojo',
    details: 'Ojo izquierdo color gris y derecho color café',
  };
  return petDetails;
}

export default tempFoundPetDetails;
