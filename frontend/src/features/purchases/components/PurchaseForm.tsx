import visa from '@assets/images/paymentIcons/Visa.png';
import mastercard from '@assets/images/paymentIcons/MasterC.png';
import american from '@assets/images/paymentIcons/American.png';
import paypal from '@assets/images/paymentIcons/PayPal.png';
import oxxo from '@assets/images/paymentIcons/oxxoPay.png';
import bank from '@assets/images/paymentIcons/Bank.svg';
import PaymentMethodCard from './PaymentMethodCard';
import type { PaymentMethod } from '../types/PaymentMethod.type';
import { Text } from '@shared/components/ui/Text';
import { useState, type ChangeEvent } from 'react';
import type { Product } from '@shared/types/purchase.types';
import Paypal from '@features/payment/components/paypal/Paypal';

const paymentMethods: PaymentMethod[] = [
  {
    method: 'Tarjeta de crédito / debito',
    icons: [visa, mastercard, american],
    element: <div />,
  },
  {
    method: 'Transferencia SPEI',
    description: 'Aprobación instantánea desde cualquier banca en línea',
    icons: [bank],
    element: <div />,
  },
  {
    method: 'Paypal',
    icons: [paypal],
    element: <Paypal />,
  },
  {
    method: 'Oxoo',
    icons: [oxxo],
    element: <div />,
  },
];

interface Props {
  product: Product;
}

const PurchaseForm = ({ product }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  // const [isExpanded, setIsExpanded] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    console.log(e.target.value);
    setSelected(e.target.value);
  }

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
                    ? 'grid-rows-[1fr] opacity-100 mt-4'
                    : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}
              >
                <div className="overflow-hidden">{pM.element}</div>
              </div>
            </>
          ))}
          <div className="flex justify-between">
            <Text weight="semibold" color="text-gray-600">
              Total a pagar:
            </Text>
            <Text variant="h1" color="text-gray-600">
              ${product.price}
            </Text>
          </div>
        </section>
      </section>
    </div>
  );
};

export default PurchaseForm;
