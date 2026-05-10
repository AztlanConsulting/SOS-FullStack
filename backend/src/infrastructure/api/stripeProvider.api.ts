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
    console.log('HOLA SOY STRIEPPROVIDER API Y THIS IS DATA:', data);
    const { amount, currency, method, name, email, idempotencyKey } = data;

    const paymentIntentKey = `${idempotencyKey}-payment-intent`;
    const confirmKey = `${idempotencyKey}-confirm`;

    const stripeAmount = Math.round(amount * 100);
    console.log('name and email and method:', name, email, method);
    if (!Number.isFinite(stripeAmount) || stripeAmount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    let intent: Stripe.PaymentIntent;
    // for card payments
    if (method === 'card') {
      if (name === undefined || name === null || name === '') {
        throw new Error('Name is required for card payments');
      }

      // Format name to have both first and last name for Stripe
      let formattedName = name.trim();
      const nameParts = formattedName.split(/\s+/);
      if (nameParts.length === 1) {
        // If only first name provided, add "Unknown" as last name
        formattedName = `${nameParts[0]} N/A`;
      }

      const customer = await stripe.customers.create(
        {
          email: email,
          name: formattedName,
        },
        {
          idempotencyKey: `${paymentIntentKey}-customer`,
        },
      );

      intent = await stripe.paymentIntents.create(
        {
          amount: stripeAmount,
          currency,
          customer: customer.id,
          payment_method_types: ['card'],
        },
        {
          idempotencyKey: paymentIntentKey,
        },
      );
      console.log('Hola tarjeta');
      console.log('PAYMENT INTENT CREATED:', intent.id);
      // for OXXO pay
    } else if (method === 'oxxo') {
      // Format name to have both first and last name for Stripe
      let formattedName = name || '';
      const nameParts = formattedName.trim().split(/\s+/);
      if (nameParts.length === 1 && nameParts[0]) {
        // If only first name provided, add "Unknown" as last name
        formattedName = `${nameParts[0]} N/A`;
      }

      intent = await stripe.paymentIntents.create(
        {
          amount: stripeAmount,
          currency,
          payment_method_types: ['oxxo'],
          confirm: true,
          payment_method_data: {
            type: 'oxxo',
            billing_details: {
              name: formattedName,
              email,
            },
          },
        },
        {
          idempotencyKey: paymentIntentKey,
        },
      );

      const oxxoDetails = intent.next_action?.oxxo_display_details;
      return {
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        clientSecret: intent.client_secret ?? null,
        oxxoDetails: oxxoDetails
          ? {
              number: oxxoDetails.number,
              expiresAfter: oxxoDetails.expires_after,
              voucherUrl: oxxoDetails.hosted_voucher_url,
            }
          : null,
      };
    } else if (method === 'spei') {
      if (name === undefined || name === null || name === '') {
        throw new Error('Name is required for SPEI payments');
      }

      if (email === undefined || email === null || email === '') {
        throw new Error('Email is required for SPEI payments');
      }

      // Format name to have both first and last name for Stripe
      let formattedName = name.trim();
      const nameParts = formattedName.split(/\s+/);
      if (nameParts.length === 1) {
        // If only first name provided, add "Unknown" as last name
        formattedName = `${nameParts[0]} N/A`;
      }

      const customer = await stripe.customers.create(
        {
          email: email,
          name: formattedName,
        },
        {
          idempotencyKey: `${paymentIntentKey}-customer`,
        },
      );

      intent = await stripe.paymentIntents.create(
        {
          amount: stripeAmount,
          currency: 'mxn', // SPEI requires MXN
          customer: customer.id,
          payment_method_types: ['customer_balance'],
          payment_method_options: {
            customer_balance: {
              funding_type: 'bank_transfer',
              bank_transfer: {
                type: 'mx_bank_transfer',
              },
            },
          },
        },
        {
          idempotencyKey: paymentIntentKey,
        },
      );

      console.log('PAYMENT INTENT CREATED:', intent.id);

      // Confirm the intent to generate bank transfer instructions
      const confirmedIntent = await stripe.paymentIntents.confirm(
        intent.id,
        {
          payment_method_data: {
            type: 'customer_balance',
          },
        },
        {
          idempotencyKey: confirmKey,
        },
      );

      // Ensure we have the bank transfer instructions for SPEI
      const bankTransfer =
        confirmedIntent.next_action?.display_bank_transfer_instructions;

      return {
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        clientSecret: intent.client_secret ?? null,
        speiDetails:
          bankTransfer &&
          bankTransfer.financial_addresses?.[0]?.spei?.clabe &&
          bankTransfer.financial_addresses?.[0]?.spei?.bank_name &&
          bankTransfer.financial_addresses?.[0]?.spei?.account_holder_name
            ? {
                clabe: bankTransfer.financial_addresses?.[0]?.spei?.clabe,
                bankName:
                  bankTransfer.financial_addresses?.[0]?.spei?.bank_name,
                bankCode:
                  bankTransfer.financial_addresses?.[0]?.spei?.bank_code ?? '',
                reference: bankTransfer.reference ?? '',
                holderAddress:
                  bankTransfer.financial_addresses?.[0]?.spei
                    ?.account_holder_address ?? '',
                holderName:
                  bankTransfer.financial_addresses?.[0]?.spei
                    ?.account_holder_name,
              }
            : null,
      };
    } else {
      throw new Error('Invalid payment method');
    }

    return {
      id: intent.id,
      amount: intent.amount,
      currency: intent.currency,
      clientSecret: intent.client_secret ?? null,
      speiDetails: null,
      oxxoDetails: null,
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
