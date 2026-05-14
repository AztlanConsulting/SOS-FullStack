import PaymentMethodCard from './PaymentMethodCard';
import { Text } from '@shared/components/ui/Text';
import { useState, type ChangeEvent } from 'react';
import type { Product } from '@shared/types/purchase.types';
import type {
  Order,
  PurchaseDetail,
} from '@features/payment/types/payment.types';
import paymentMethods from '../services/paymentMethods.service';
import type { LostPetReportData } from '@/shared/types/petReport.types';
import { useLocationContext } from '@/shared/context/Location.context';

interface Props {
  product?: Product;
  petReportData: LostPetReportData | null;
  success: () => void;
  purchaseDetail: PurchaseDetail;
}

// Logic to handle payment method, display different cards for each payment
// method and display payment details on option click, as well as the
// Price of purchase
const PurchaseForm = ({
  product,
  petReportData,
  purchaseDetail,
  success,
}: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { currencyCode } = useLocationContext();

  function handleChange(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    setSelected(e.target.value);
  }

  if (!Boolean(petReportData) && !Boolean(product)) {
    return null;
  }

  const orderDetails: Order = {
    amount: Number(
      product?.price ?? petReportData?.planDetails!.totalPrice ?? 0,
    ),
    currency: currencyCode,
    ...(product && {
      product: {
        productId: product._id,
        productName: product.name,
      },
    }),
    ...(petReportData && {
      plan: petReportData,
    }),
  };

  console.log(orderDetails);

  return (
    <div>
      <Text
        className="text-center mb-4 text-gray-700"
        variant="h3"
        weight="semibold"
      >
        Método de pago
      </Text>
      <section className="w-full flex justify-center">
        <section className="grid grid-cols-1 gap-5 md:w-4/5 w-5/6">
          {paymentMethods.map((pM, idx) => (
            <div key={idx}>
              <PaymentMethodCard paymentMethod={pM} onChecked={handleChange} />
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  selected == pM.method
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  {pM.element(orderDetails, purchaseDetail, success)}
                </div>
              </div>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
};

export default PurchaseForm;
