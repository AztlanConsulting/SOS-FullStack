import axiosInstance from '@/shared/utils/axios';
import type { PetFilter, PetInfo } from '../types/petCollection.types';

async function uploadImage(
  file: File,
  page: number = 0,
  filter: PetFilter,
): Promise<PetInfo[]> {
  const formData = new FormData();
  formData.append('image', file);
  const vectorImages = await axiosInstance.post(
    '/images/findSimilarPets',
    formData,
    {
      params: { page: page - 1, ...filter },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return vectorImages.data;
}

export default uploadImage;
