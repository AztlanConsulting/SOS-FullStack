import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import getProductImage from '../services/getProductImage.service';

export default function usePurchase() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      console.log('Error al ejecutar la compra');
      navigate('/');
    }
  }, [state, navigate]);

  // if (!state) return null; // evita que el resto del código truene

  const { productId, productType, planDetails } = state;
  const successHook = useState(false);
  const query = useQuery({
    queryKey: ['img'],
    queryFn: async () => await getProductImage(productType, productId),
    enabled: !planDetails,
  });

  return {
    state,
    successHook,
    query,
  };
}
