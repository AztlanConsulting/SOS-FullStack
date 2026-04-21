import type { PaymentProvider } from './paymentProvider.port';

export interface PaypalAccessToken {
  accessToken: string | null;
  error: string | null;
}

export interface PaymentOrderId {
  orderId: string | null;
  error: string | null;
}

export interface PaymentSuccess {
  id?: string;
  error?: string;
}

export interface PaypalApi extends PaymentProvider {
  getAccessToken(): Promise<PaypalAccessToken>;
  completeOrder(orderId: string): Promise<PaymentSuccess>;
}
