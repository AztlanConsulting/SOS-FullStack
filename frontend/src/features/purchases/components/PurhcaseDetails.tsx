import { Text } from '@shared/components/ui/Text';
import ProductDetail from './ProductDetail';
import PlanDetail from './PlanDetail';
import type { Plan, Product } from '@shared/types/purchase.types';
import { useNavigate } from 'react-router';
import ConfirmPaymentModal from './ConfirmPaymentModal';

interface Props {
  plan?: Plan;
  product?: Product;
  success: boolean;
}

// Get all product details and display them to the user
const PurchaseDetails = ({ plan, product, success }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="pt-4 md:p-2">
      <Text
        variant="h3"
        className="text-center  text-gray-700"
        weight="semibold"
      >
        Detalles de la compra
      </Text>
      {/* Different UI elements depending if its a plan or manual / workshop */}
      {plan && <PlanDetail />}
      {product && <ProductDetail product={product} />}
      {/* Modal to show success state */}
      {success && (
        <ConfirmPaymentModal plan={plan} product={product} />
        // <Modal
        //   title={'Compra exitosa'}
        //   description={`El producto se ha comprado de manera exitosa
        //     Nombre: ${product?.name}
        //     Precio: ${product?.price}
        //     `}
        //   onClose={() => navigate('/')}
        // />
      )}
    </div>
  );
};

export default PurchaseDetails;
