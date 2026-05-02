import axiosInstance from '@/shared/utils/axios';

async function uploadImage(file: File, page: number = 0) {
  const formData = new FormData();
  formData.append('image', file);
  console.log(file, page);
  const vectorImages = await axiosInstance.post(
    '/images/findSimilarPets',
    formData,
    {
      params: { page },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  console.log(vectorImages.data);
  return vectorImages;
}

export default uploadImage;
