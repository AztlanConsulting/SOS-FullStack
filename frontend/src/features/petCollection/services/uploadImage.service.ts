import axiosInstance from '@/shared/utils/axios';
import type { PetInfo } from '../types/petCollection.types';

async function uploadImage(
  file: File,
  page: number = 0,
  searchTerm?: string,
): Promise<PetInfo[]> {
  const formData = new FormData();
  formData.append('image', file);
  console.log(file, page);
  const vectorImages = await axiosInstance.post(
    '/images/findSimilarPets',
    formData,
    {
      params: { page: page - 1 },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return vectorImages.data;
}

export default uploadImage;
