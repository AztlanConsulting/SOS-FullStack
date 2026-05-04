import type { LostPetReportData } from '@/shared/types/petReport.types';
import axiosInstance from '@shared/utils/axios';
import { exportPosterAsFile } from '@/shared/services/posterExport.services';

/**
 * Sends a lost pet report with form data (info, images, and plan).
 *
 * @param reportData - Pet report information including images and plan details.
 * @returns Backend response after creating the report.
 */
export const createLostPetReportRequest = async (
  reportData: LostPetReportData,
) => {
  const formData = new FormData();

  formData.append('name', reportData.name || '');
  formData.append('species', reportData.species);
  formData.append('date', reportData.date);
  formData.append('breed', reportData.breed || '');
  formData.append('sex', reportData.sex || 'Desconocido');
  formData.append('color', reportData.color);
  formData.append('size', reportData.size || 'Mediana: 11 a 25 kg');
  formData.append('description', reportData.description || '');
  formData.append('contactName', reportData.contactName);
  formData.append('phoneNumber', reportData.phoneNumber);
  formData.append('email', reportData.email);
  formData.append('location', reportData.address);
  formData.append('locationCoords', JSON.stringify(reportData.locationCoords));
  formData.append('planName', reportData.planName);
  formData.append('planDetails', JSON.stringify(reportData.planDetails));
  reportData.images.forEach((file) => {
    formData.append('images', file);
  });
  await exportPosterAsFile(
    document.getElementById('poster'),
    `${reportData.name}-poster`,
  );

  const { data } = await axiosInstance.post('/clients/lost-pet', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data;
};
