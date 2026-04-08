import Stripe from 'stripe';

import type {
  PaymentIntentDTO,
  PaymentIntentResult,
  EventDTO,
  PaymentProvider,
} from '../../domain/ports/paymentProvider.port';

export const StripeProvider: PaymentProvider = {
  async createIntent(data: PaymentIntentDTO): Promise<PaymentIntentResult> {
    const key = process.env.STRIPE_SECRET_KEY;

    if (key === undefined || key === null || key === '') {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }

    const stripe = new Stripe(key);
    const { amount, currency } = data;

    const intent = await stripe.paymentIntents.create({
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
  },

  async constructEvent(data: EventDTO): Promise<Stripe.Event> {
    const key = process.env.STRIPE_SECRET_KEY;

    if (key === undefined || key === null || key === '') {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }

    const stripe = new Stripe(key);
    const event = await stripe.webhooks.constructEvent(
      data.payload,
      data.sig,
      data.secret,
    );

    return event;
  },
};
