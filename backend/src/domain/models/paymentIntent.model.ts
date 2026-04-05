export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  clientSecret: string | null;
}
