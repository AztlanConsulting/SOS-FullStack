import axiosInstance from '@shared/utils/axios';

async function getProductImage(type: string, productId: string) {
  const types: Record<string, string> = {
    manual: 'manuals',
    taller: 'workshop',
  };

  const response = await axiosInstance.get(`/${types[type]}/`, {
    params: {
      id: productId,
    },
  });

  if (response.status == 200) return response.data;
  else throw Error('Error recuperando información');
}

export default getProductImage;
