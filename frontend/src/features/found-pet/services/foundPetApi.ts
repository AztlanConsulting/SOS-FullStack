import axiosInstance from '@shared/utils/axios';
import type { PetReportData } from '../types/petReport.types';

export const reportFoundPet = async (data: PetReportData) => {
  console.log('aa', data.images);

  const imagesBase64 = await Promise.all(
    data.images.map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }),
  );

  const response = await axiosInstance.post('/found-pets/report', {
    species: data.species,
    date: data.date,
    breed: data.breed,
    sex: data.sex,
    color: data.color,
    size: data.size,
    description: data.description,
    location: data.address,
    locationCoords: data.locationCoords,
    contactName: data.contactName,
    phoneNumber: data.phoneNumber,
    email: data.email,
    images: imagesBase64,
  });
  return response.data;
};
