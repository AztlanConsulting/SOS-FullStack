import type {
  EmailService,
  SendStripePaymentEmailDTO,
} from '@domain/ports/emailService.port';

export const sendPaymentEmail = async (
  emailService: EmailService,
  data: SendStripePaymentEmailDTO,
): Promise<void> => {
  return await emailService.sendStripePaymentEmail(data);
};
