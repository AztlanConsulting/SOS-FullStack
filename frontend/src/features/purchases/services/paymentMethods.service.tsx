import visa from '@assets/images/paymentIcons/Visa.webp';
import mastercard from '@assets/images/paymentIcons/MasterC.webp';
import american from '@assets/images/paymentIcons/American.webp';
import paypal from '@assets/images/paymentIcons/PayPal.webp';
import oxxo from '@assets/images/paymentIcons/oxxoPay.webp';
import bank from '@assets/images/paymentIcons/Bank.svg';
import type { PaymentMethod } from '../types/PaymentMethod.type';
import Paypal from '@features/payment/components/paypal/Paypal';
import type {
  Order,
  PurchaseDetail,
} from '@features/payment/types/payment.types';
import StripeCard from '@/features/payment/components/stripe/StripeCard';

const paymentMethods: PaymentMethod[] = [
  {
    method: 'Tarjeta de crédito / débito',
    icons: [visa, mastercard, american],
    element: (
      data: Order,
      purchaseDetails: PurchaseDetail,
      success: () => void,
      pending: () => void,
    ) => (
      <StripeCard
        data={{ ...data, method: 'card' }}
        success={success}
        pending={pending}
        purchaseDetail={purchaseDetails}
      />
    ),
  },
  {
    method: 'Transferencia SPEI',
    description:
      'Paga en línea desde tu banco. Confirmación en minutos hasta el siguiente día hábil.',
    icons: [bank],
    element: (
      data: Order,
      purchaseDetails: PurchaseDetail,
      success: () => void,
      pending: () => void,
    ) => (
      <StripeCard
        data={{ ...data, method: 'spei' }}
        success={success}
        pending={pending}
        purchaseDetail={purchaseDetails}
      />
    ),
  },
  {
    method: 'Paypal',
    icons: [paypal],
    element: (
      data: Order,
      purchaseDetails: PurchaseDetail,
      success: () => void,
    ) => (
      <Paypal data={data} success={success} purchaseDetail={purchaseDetails} />
    ),
  },
  {
    method: 'OXXO',
    description: 'Paga en efectivo en un OXXO. Aprobación en 1 día hábil',
    icons: [oxxo],
    element: (
      data: Order,
      purchaseDetails: PurchaseDetail,
      success: () => void,
      pending: () => void,
    ) => (
      <StripeCard
        data={{ ...data, method: 'oxxo' }}
        success={success}
        pending={pending}
        purchaseDetail={purchaseDetails}
      />
    ),
  },
];

export default paymentMethods;
