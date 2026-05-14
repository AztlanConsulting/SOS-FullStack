import axiosInstance from '@/shared/utils/axios';
import type { PetFilter } from '../types/petCollection.types';

async function countPages(file: File, filter: PetFilter): Promise<number> {
  const formData = new FormData();
  formData.append('image', file);
  const pages = await axiosInstance.post('/images/countPets', formData, {
    params: filter,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return pages.data;
}

export default countPages;
