import { Text } from '@shared/components/ui/Text';
import ProductDetail from './ProductDetail';
import PlanDetail from './PlanDetail';
import type { Product } from '@shared/types/purchase.types';
import ConfirmPaymentModal from './ConfirmPaymentModal';
import type { PlanDetails } from '@features/plans/types/plan.types';

interface Props {
  plan?: PlanDetails;
  product?: Product;
  success: boolean;
}

// Get all product details and display them to the user
const PurchaseDetails = ({ plan, product, success }: Props) => {
  return (
    <div className="pt-4 md:p-2">
      <Text
        variant="h3"
        className="text-center  text-gray-700"
        weight="semibold"
      >
        Detalles de la compra
      </Text>
      <div
        className={`w-10/12 mx-auto mt-3 mb-3 md:mb-0 rounded-c ${product ? 'bg-secondary' : 'bg-gray-100 border-2 border-gray-200'} p-4 py-6`}
      >
        <div className="flex flex-col items-center md:gap-3 gap-1">
          {/* Different UI elements depending if its a plan or manual / workshop */}
          {plan && <PlanDetail plan={plan} />}
          {product && <ProductDetail product={product} />}
        </div>
      </div>
      {/* Modal to show success state */}
      {success && <ConfirmPaymentModal plan={plan} product={product} />}
    </div>
  );
};

export default PurchaseDetails;
