import type { Request, Response } from 'express';
import { createPaymentIntent } from '../../use-cases/payments/createPaymentIntent.usecase';
import { handleStripeWebhook } from '../../use-cases/payments/handleStripeWebhook.usecase';
import { createPendingIntentDB } from '../../use-cases/payments/createPendingIntentDB.usecase';
import { markAsSucceededDB } from '../../use-cases/payments/markAsSuccededDB.usecase';
import type Stripe from 'stripe';
import { registerClientUseCase } from '../../use-cases/clients/registerClient.usecase';
import { userDataAccess } from '../data-access/user.data-access';
import { emailProvider } from '../../infrastructure/api/email.service';

export const makeCreatePaymentIntent = () => {
  return async (req: Request, res: Response) => {
    try {
      const { amount, currency } = req.body as {
        amount?: number;
        currency?: string;
      };

      if (amount === undefined || currency === undefined) {
        return res.status(400).json({ error: 'Missing amount or currency' });
      }

      const result = await createPaymentIntent({ amount, currency });

      await createPendingIntentDB({
        stripeId: result.id,
        amount: result.amount,
        currency: result.currency,
      });

      res.json(result);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Payment failed';
      res.status(500).json({ error: message });
    }
  };
};

export const makehandleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (
    typeof sig !== 'string' ||
    typeof webhookSecret !== 'string' ||
    webhookSecret.trim() === ''
  ) {
    console.error('Webhook Error: Missing signature or secret');
    res.status(400).send('Webhook Error: Missing signature or secret');
    return;
  }

  try {
    // Access the raw body attached by the middleware in index.ts
    const { rawBody } = req as Request & { rawBody: Buffer };

    if (!(rawBody instanceof Buffer)) {
      throw new Error('Raw body not found. Check body-parser configuration.');
    }

    // Use the raw body for signature verification
    const event = await handleStripeWebhook({
      payload: rawBody,
      sig: sig as string,
      secret: webhookSecret,
    });

    console.log(`Webhook received: ${event.type}`);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update the payment status in MongoDB
      const result = await markAsSucceededDB(paymentIntent.id);
      if (result === 'not_found') {
        console.warn('Payment not found in DB');
      }

      if (result === 'already_updated') {
        console.log('Webhook already processed (idempotent)');
      }
      console.log(
        `Payment ${paymentIntent.id} succeeded. Updated status: ${result}`,
      );
    }

    res.json({ received: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown webhook error';
    res.status(400).send(`Webhook Error: ${message}`);
  }
};

export const paymentController = {
    createPaymentIntent: async (req: Request, res: Response) => {
        try {
            const { amount, currency, email, petName } = req.body;

            // 1. Initiate the payment on Stripe
            const paymentIntent = await createPaymentIntent({amount, currency});

            // 2: Immediate registry (US-17): We do not need to wait for the payment to be successful
            // We execute the registry. If the user already exists, the UseCase will handle it.
            await registerClientUseCase(
                userDataAccess,
                emailProvider,
                { email, petName }
            );

            // 3. Respond to the frontend with clientSecret so the payment form is shown.
            res.status(200).json({
                clientSecret: paymentIntent.clientSecret,
                registrationStarted: true 
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};