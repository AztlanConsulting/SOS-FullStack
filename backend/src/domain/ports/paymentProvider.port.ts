import type { PaymentIntent } from '../models/paymentIntent.model';

export interface PaymentProvider {
  createIntent(amount: number, currency: string): Promise<PaymentIntent>;
}
