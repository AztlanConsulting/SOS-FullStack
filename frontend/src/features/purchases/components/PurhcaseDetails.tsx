import { Text } from '@shared/components/ui/Text';
import ProductDetail from './ProductDetail';
import PlanDetail from './PlanDetail';
import type { Product } from '@shared/types/purchase.types';

interface Props {
  plan?: {
    planType: string;
    duration: string;
    distance: string;
  };
  product?: Product;
}

const PurchaseDetails = ({ plan, product }: Props) => {
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
      {product && <ProductDetail product={product} />}
    </div>
  );
};

export default PurchaseDetails;
