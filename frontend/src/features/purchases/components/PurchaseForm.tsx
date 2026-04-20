import visa from '@assets/images/paymentIcons/Visa.png';
import mastercard from '@assets/images/paymentIcons/MasterC.png';
import american from '@assets/images/paymentIcons/American.png';
import paypal from '@assets/images/paymentIcons/PayPal.png';
import oxxo from '@assets/images/paymentIcons/oxxoPay.png';
import bank from '@assets/images/paymentIcons/Bank.svg';
import PaymentMethodCard from './PaymentMethodCard';
import type { PaymentMethod } from '../types/PaymentMethod.type';
import { Text } from '@shared/components/ui/Text';

const PurchaseForm = () => {
  const paymentMethods: PaymentMethod[] = [
    {
      method: 'Tarjeta de crédito / debito',
      icons: [visa, mastercard, american],
    },
    {
      method: 'Transferencia SPEI',
      description: 'Aprobación instantánea desde cualquier banca en línea',
      icons: [bank],
    },
    {
      method: 'Paypal',
      icons: [paypal],
    },
    {
      method: 'Oxoo',
      icons: [oxxo],
    },
  ];

  return (
    <div>
      <Text className="text-center mb-4" variant="h2">
        Método de pago
      </Text>
      <section className="w-full flex justify-center">
        <section className="grid grid-cols-1 gap-5 md:w-4/5 w-5/6">
          {paymentMethods.map((pM, idx) => (
            <PaymentMethodCard
              key={idx}
              method={pM.method}
              icons={pM.icons}
              description={pM.description}
            />
          ))}
        </section>
      </section>
    </div>
  );
};

export default PurchaseForm;
