import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import getProductImage from '../services/getProductImage.service';

export default function usePurchase() {
  const location = useLocation();
  const { state } = location ?? { state: null };

  const { productId, productType } = state
    ? state
    : {
        productId: null,
        productType: null,
      };
  const query = useQuery({
    queryKey: ['img', productId, productType],
    queryFn: async () => await getProductImage(productType, productId),
    enabled: Boolean(productId && productType),
  });

  return {
    state,
    query,
  };
}
