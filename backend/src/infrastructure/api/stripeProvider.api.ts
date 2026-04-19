import Stripe from 'stripe';

import type {
  PaymentIntentDTO,
  PaymentIntentResult,
  EventDTO,
  PaymentProvider,
} from '../../domain/ports/paymentProvider.port';

export const StripeProvider: PaymentProvider = {
  /**
   * Create a Stripe payment intent for card, OXXO, or SPEI payments.
   * @param data - Payment intent data including amount, currency, method, and optional customerId
   * @returns PaymentIntentResult with intent ID, amount, currency, and client secret
   */
  async createIntent(data: PaymentIntentDTO): Promise<PaymentIntentResult> {
    const key = process.env.STRIPE_SECRET_KEY;

    if (key === undefined || key === null || key === '') {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }

    const stripe = new Stripe(key);
    const { amount, currency, method = 'auto', customerId } = data;

    let intent: Stripe.PaymentIntent;

    // for card payments and OXXO pay
    if (method === 'auto') {
      intent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      });
    }

    // for SPEI bank transfers in Mexico
    else if (method === 'spei') {
      if (
        customerId === undefined ||
        customerId === null ||
        customerId === ''
      ) {
        throw new Error('customerId is required for SPEI payments');
      }

      intent = await stripe.paymentIntents.create({
        amount,
        currency: 'mxn', // SPEI requires MXN
        customer: customerId,
        payment_method_types: ['customer_balance'],
        payment_method_options: {
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'mx_bank_transfer',
            },
          },
        },
      });
    } else {
      throw new Error('Invalid payment method');
    }

    return {
      id: intent.id,
      amount: intent.amount,
      currency: intent.currency,
      clientSecret: intent.client_secret ?? null,
    };
  },

  /**
   * Construct and verify a Stripe webhook event using the signature.
   * @param data - Event data containing payload, signature, and webhook secret
   * @returns The verified Stripe Event object
   */
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
