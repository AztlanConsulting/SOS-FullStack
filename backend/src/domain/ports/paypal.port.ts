export interface PaypalAccessToken {
  accessToken: string;
  error: string;
}

export interface PaymentApi {
  getAccessToken(): Promise<PaypalAccessToken>;
  createOrder(intent: string): Promise<string | null[]>;
  completeOrder(orderId: string, intent: string): Promise<string | null[]>;
}
