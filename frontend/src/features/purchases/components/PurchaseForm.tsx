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
  pending: () => void;
  purchaseDetail: PurchaseDetail;
  onMethodSelect?: () => void;
}

// Logic to handle payment method, display different cards for each payment
// method and display payment details on option click, as well as the
// Price of purchase
const PurchaseForm = ({
  product,
  petReportData,
  purchaseDetail,
  success,
  pending,
  onMethodSelect,
}: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { currencyCode, exchangeRate } = useLocationContext();

  function handleChange(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    onMethodSelect?.();
    setSelected(e.target.value);
  }

  if (!Boolean(petReportData) && !Boolean(product)) {
    return null;
  }

  const orderDetails: Order = {
    amount:
      Math.round(
        (product?.price ?? petReportData?.planDetails!.totalPrice ?? 0) *
          exchangeRate *
          100,
      ) / 100,
    currency: currencyCode,
    name: purchaseDetail.userName ?? petReportData?.contactName ?? undefined,
    email: purchaseDetail.userEmail ?? petReportData?.email ?? undefined,
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
        className="text-center py-6 text-black border-t border-gray-400 lg:border-none"
        variant="body"
        weight="semibold"
      >
        Método de pago
      </Text>
      <section className="w-full flex justify-center">
        <section className="grid grid-cols-1 gap-5 md:w-4/5 w-5/6">
          {paymentMethods
            .filter((pM) => {
              if (
                (pM.method === 'Transferencia SPEI' || pM.method === 'OXXO') &&
                currencyCode !== 'MXN'
              ) {
                return false;
              }
              return true;
            })
            .map((pM, idx) => (
              <div key={idx}>
                <PaymentMethodCard
                  paymentMethod={pM}
                  onChecked={handleChange}
                />
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    selected == pM.method
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    {selected === pM.method &&
                      pM.element(
                        orderDetails,
                        purchaseDetail,
                        success,
                        pending,
                      )}
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
