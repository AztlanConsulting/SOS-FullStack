import Stripe from 'stripe';
import type { PaymentProvider } from '../../domain/ports/paymentProvider.port';

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;

    if (key === undefined || key === '') {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }

    this.stripe = new Stripe(key);
  }

  async createIntent(amount: number, currency: string) {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });
    return {
      id: intent.id,
      amount: intent.amount,
      currency: intent.currency,
      clientSecret: intent.client_secret ?? null,
    };
  }

  constructEvent(payload: string | Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(payload, sig, secret);
  }
}
