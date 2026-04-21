import { Text } from '@shared/components/ui/Text';
import ProductDetail from './ProductDetail';
import PlanDetail from './PlanDetail';
import { useQuery } from '@tanstack/react-query';
import getProductImage from '../services/getProductImage';
import { useLocation } from 'react-router';
import { useEffect } from 'react';

interface Props {
  plan?: {
    planType: string;
    duration: string;
    distance: string;
  };
  product?: {
    productId: string;
    productType: string;
  };
}

const PurchaseDetails = ({ plan, product }: Props) => {
  const { state } = useLocation();
  const { productId, productType } = state;

  const query = useQuery({
    queryKey: ['img'],
    queryFn: async () => await getProductImage(productType, productId),
    enabled: !plan,
  });

  return (
    <div className="pt-4 md:p-2">
      <Text
        variant="h3"
        className="text-center  text-gray-700"
        weight="semibold"
      >
        Detalles de la compra
      </Text>
      {plan && <PlanDetail />}
      {product && <ProductDetail query={query} />}
    </div>
  );
};

export default PurchaseDetails;
