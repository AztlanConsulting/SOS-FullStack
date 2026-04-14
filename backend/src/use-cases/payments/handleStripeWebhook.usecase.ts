import { StripeProvider } from '../../infrastructure/api/stripeProvider.api';
import type { EventDTO } from '../../domain/ports/paymentProvider.port';
import type { Stripe } from 'stripe';

export const handleStripeWebhook = async (
  data: EventDTO,
): Promise<Stripe.Event> => {
  return await StripeProvider.constructEvent({
    payload: data.payload,
    sig: data.sig,
    secret: data.secret,
  });
};
