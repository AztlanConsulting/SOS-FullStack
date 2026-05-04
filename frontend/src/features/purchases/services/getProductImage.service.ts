import type { Product } from '@shared/types/purchase.types';
import axiosInstance from '@shared/utils/axios';

async function getProductImage(
  type: string,
  productId: string,
): Promise<Product> {
  const types: Record<string, string> = {
    manual: 'manuals/getManuals',
    taller: 'workshop',
  };

  const response = await axiosInstance.get(`/${types[type]}`, {
    params: {
      id: productId,
    },
  });

  if (response.status == 200) {
    let product;
    const key = Object.keys(response.data)[0];

    if (type == 'manual') {
      product = response.data[key][0];
    } else product = response.data[key];
    return product;
  } else throw Error('Error recuperando información');
}

export default getProductImage;
