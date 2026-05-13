import type { Stripe } from 'stripe';

export interface SendStripePaymentEmailDTO {
  to: string;
  name: string;
  amount: number;
  method: 'oxxo' | 'spei';

  oxxoNumber?: string;
  voucherUrl?: string;
  expiresAfter?: number;

  clabe?: string;
  bankName?: string;
  reference?: string;
  bankCode?: string;
  holderName?: string;
  holderAddress?: Stripe.Address;
}

export interface SendManualEmailDTO {
  to: string;
  manualName: string;
  imageUrl: string;
  pdfUrl?: string;
}

export interface StripeEmailService {
  sendStripePaymentEmail(data: SendStripePaymentEmailDTO): Promise<void>;
}

export interface ManualEmailService {
  sendManualEmail(data: SendManualEmailDTO): Promise<void>;
}
