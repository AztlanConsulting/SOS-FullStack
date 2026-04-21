import axiosInstance from '@shared/utils/axios';
import type { PetReportData } from '../types/petReport.types';

export const reportFoundPet = async (data: PetReportData) => {
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
  });
  return response.data;
};
