import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'react-router';
import getProductImage from '../services/getProductImage.service';

export default function usePurchase() {
  const { state } = useLocation();

  // if (!state) return null; // evita que el resto del código truene

  const { productId, productType } = state;
  const successHook = useState(false);
  const query = useQuery({
    queryKey: ['img'],
    queryFn: async () => await getProductImage(productType, productId),
    enabled: Boolean(productId && productType),
  });

  return {
    state,
    successHook,
    query,
  };
}
