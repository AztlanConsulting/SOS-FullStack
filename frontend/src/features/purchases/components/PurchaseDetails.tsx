import { Text } from '@shared/components/ui/Text';
import ProductDetail from './ProductDetail';
import PlanDetail from './PlanDetail';
import type { Product } from '@shared/types/purchase.types';
import ConfirmPaymentModal from './ConfirmPaymentModal';
import type { LostPetReportData } from '@/shared/types/petReport.types';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { useLocationContext } from '@/shared/context/Location.context';

interface Props {
  reportData: LostPetReportData | null;
  product?: Product;
  success: boolean;
}

// Get all product details and display them to the user
const PurchaseDetails = ({ reportData, product, success }: Props) => {
  const plan = reportData?.planDetails ?? null;
  const { currencyCode, exchangeRate } = useLocationContext();

  const rawPrice = product?.price ?? plan?.totalPrice ?? 0;
  const localizedPrice = Math.round(rawPrice * exchangeRate * 100) / 100;
  return (
    <div className="pt-4 md:p-2 w-10/12 mx-auto">
      <Text
        variant="h3"
        className="text-center  text-gray-700"
        weight="semibold"
      >
        Detalles de la compra
      </Text>
      <div
        className={`mt-3 mb-3 md:mb-0 rounded-lg ${product ? 'bg-secondary' : 'bg-gray-100 border-2 border-gray-200'} p-4 py-6`}
      >
        <div className="flex flex-col items-center md:gap-3 gap-1">
          {/* Different UI elements depending if its a plan or manual / workshop */}
          {reportData && <PlanDetail reportData={reportData} />}
          {product && <ProductDetail product={product} />}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Text weight="semibold" color="text-gray-600">
          Total a pagar:
        </Text>
        <Text variant="h1" color="text-gray-600">
          {formatCurrency(localizedPrice, currencyCode)} {currencyCode}
        </Text>
      </div>
      {/* Modal to show success state */}
      {success && <ConfirmPaymentModal plan={reportData} product={product} />}
    </div>
  );
};

export default PurchaseDetails;
