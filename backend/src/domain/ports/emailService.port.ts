export interface SendStripePaymentEmailDTO {
  to: string;
  username: string;
  password: string;
  amount: number;
  currency: string;
  method: string;
}

export interface EmailService {
  sendStripePaymentEmail(data: SendStripePaymentEmailDTO): Promise<void>;
}
