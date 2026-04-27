import PaymentMethodCard from './PaymentMethodCard';
import { Text } from '@shared/components/ui/Text';
import { useState, type ChangeEvent } from 'react';
import type { Product } from '@shared/types/purchase.types';
import type {
  Order,
  PurchaseDetail,
} from '@features/payment/types/payment.types';
import paymentMethods from '../services/paymentMethods.service';
import type { PlanDetails } from '@features/plans/types/plan.types';

interface Props {
  product?: Product;
  plan?: PlanDetails;
  purchaseDetail: PurchaseDetail;
  success: () => void;
}

// Logic to handle payment method, display different cards for each payment
// method and display payment details on option click, as well as the
// Price of purchase
const PurchaseForm = ({ product, plan, purchaseDetail, success }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    setSelected(e.target.value);
  }

  const orderDetails: Order | null = {
    amount: product?.price ?? plan!.price,
    currency: 'MXN',
    ...(product && {
      product: {
        productId: product._id,
        productName: product.name,
      },
    }),
    ...(plan && {
      plan: plan,
    }),
  };

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
            <>
              <PaymentMethodCard
                key={idx}
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
                  {pM.element(orderDetails, purchaseDetail, success)}
                </div>
              </div>
            </>
          ))}
        </section>
      </section>
    </div>
  );
};

export default PurchaseForm;
