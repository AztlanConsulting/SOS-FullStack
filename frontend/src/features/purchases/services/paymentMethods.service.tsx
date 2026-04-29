import visa from '@assets/images/paymentIcons/Visa.png';
import mastercard from '@assets/images/paymentIcons/MasterC.png';
import american from '@assets/images/paymentIcons/American.png';
import paypal from '@assets/images/paymentIcons/PayPal.png';
import oxxo from '@assets/images/paymentIcons/oxxoPay.png';
import bank from '@assets/images/paymentIcons/Bank.svg';
import type { PaymentMethod } from '../types/PaymentMethod.type';
import Paypal from '@features/payment/components/paypal/Paypal';
import type {
  Order,
  PurchaseDetail,
} from '@features/payment/types/payment.types';
import type { PetReportData } from '@/features/users/types/petReport.types';

const paymentMethods: PaymentMethod[] = [
  {
    method: 'Tarjeta de crédito / debito',
    icons: [visa, mastercard, american],
    element: (
      data: Order,
      purchaseDetails: PurchaseDetail,
      success: () => void,
    ) => (
      <Paypal data={data} success={success} purchaseDetail={purchaseDetails} />
    ),
  },
  {
    method: 'Transferencia SPEI',
    description: 'Aprobación instantánea desde cualquier banca en línea',
    icons: [bank],
    element: (
      data: Order,
      purchaseDetails: PurchaseDetail,
      success: () => void,
    ) => (
      <Paypal data={data} success={success} purchaseDetail={purchaseDetails} />
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
    method: 'Oxoo',
    icons: [oxxo],
    element: (
      data: Order,
      purchaseDetails: PurchaseDetail,
      success: () => void,
    ) => (
      <Paypal data={data} success={success} purchaseDetail={purchaseDetails} />
    ),
  },
];

export default paymentMethods;
