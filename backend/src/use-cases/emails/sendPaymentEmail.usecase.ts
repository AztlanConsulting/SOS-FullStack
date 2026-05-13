import type {
  StripeEmailService,
  SendStripePaymentEmailDTO,
} from '@domain/ports/emailService.port';

export const sendPaymentEmail = async (
  stripeEmailService: StripeEmailService,
  data: SendStripePaymentEmailDTO,
): Promise<void> => {
  return await stripeEmailService.sendStripePaymentEmail(data);
};
