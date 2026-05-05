import axiosInstance from '@/shared/utils/axios';

async function countPages(file: File): Promise<number> {
  const formData = new FormData();
  formData.append('image', file);
  const pages = await axiosInstance.post('/images/countPets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return pages.data;
}

export default countPages;
