export interface PaypalAccessToken {
  accessToken: string;
  error: string;
}

export interface PaymentApi {
  getAccessToken(): Promise<PaypalAccessToken>;
  processPayment(intent: string): Promise<string | null[]>;
  completeOrder(orderId: string, intent: string): Promise<string | null[]>;
}
