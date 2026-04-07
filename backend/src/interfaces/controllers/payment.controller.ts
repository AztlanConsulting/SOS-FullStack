import type { Request, Response } from 'express';
import type { ProcessPayment } from '../../use-cases/payments/processPayment.usecase';
import { getDB } from '../../infrastructure/database/mongoClient';
import type { StripeProvider } from '../../infrastructure/api/stripeProvider.api';

export const makeCreatePaymentIntent = (processPayment: ProcessPayment) => {
  return async (req: Request, res: Response) => {
    try {
      const { amount, currency } = req.body as {
        amount?: number;
        currency?: string;
      };

      if (amount === undefined || currency === undefined) {
        return res.status(400).json({ error: 'Missing amount or currency' });
      }

      const result = await processPayment.execute(amount, currency);

      // Save the pending payment to MongoDB
      await getDB().collection('payments').insertOne({
        stripeId: result.id,
        amount,
        currency,
        status: 'pending',
        createdAt: new Date(),
      });

      res.json(result);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Payment failed';
      res.status(500).json({ error: message });
    }
  };
};

export const makeHandleStripeWebhook = (stripeProvider: StripeProvider) => {
  return async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      console.error('Webhook Error: Missing signature or secret');
      res.status(400).send('Webhook Error: Missing signature or secret');
      return;
    }

    try {
      // Access the raw body attached by the middleware in index.ts
      const { rawBody } = req as Request & { rawBody: Buffer };

      if (!rawBody) {
        throw new Error('Raw body not found. Check body-parser configuration.');
      }

      // Use the raw body for signature verification
      const event = stripeProvider.constructEvent(
        rawBody,
        sig as string,
        webhookSecret,
      );

      console.log(`Webhook received: ${event.type}`);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as any;

        // Update the payment status in MongoDB
        await getDB()
          .collection('payments')
          .updateOne(
            { stripeId: paymentIntent.id },
            { $set: { status: 'succeeded', updatedAt: new Date() } },
          );
        console.log(`Payment ${paymentIntent.id} succeeded and updated in DB.`);
      }

      res.json({ received: true });
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  };
};
