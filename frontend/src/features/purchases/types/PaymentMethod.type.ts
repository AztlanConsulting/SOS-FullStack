import type {
  Order,
  PurchaseDetail,
} from '@features/payment/types/payment.types';

export interface PaymentMethod {
  method: string;
  icons: string[];
  description?: string;
  element: (
    data: Order,
    purchaseDetail: PurchaseDetail,
    success: () => void,
  ) => React.ReactNode;
}
