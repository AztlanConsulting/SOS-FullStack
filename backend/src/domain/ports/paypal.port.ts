export interface PaypalAccessToken {
  accessToken: string | null;
  error: string | null;
}

export interface PaymentOrderId {
  orderId: string | null;
  error: string | null;
}

export interface PaymentApi {
  getAccessToken(): Promise<PaypalAccessToken>;
  createOrder(): Promise<PaymentOrderId>;
  completeOrder(orderId: string): Promise<string | null[]>;
}
