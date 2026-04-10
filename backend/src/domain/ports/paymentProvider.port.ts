import type { Stripe } from 'stripe';

export interface PaymentIntentDTO {
  amount: number;
  currency: string;
  customerId?: string; // for SPEI
  method?: string; // to seperate spei from the other methods
}

export interface PaymentIntentResult {
  id: string;
  amount: number;
  currency: string;
  clientSecret: string | null;
}

export interface EventDTO {
  payload: string | Buffer;
  sig: string;
  secret: string;
}

export interface PaymentProvider {
  createIntent(data: PaymentIntentDTO): Promise<PaymentIntentResult>;
  constructEvent(data: EventDTO): Promise<Stripe.Event>;
}
