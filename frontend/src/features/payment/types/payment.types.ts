import type { LostPetReportData } from '@/shared/types/petReport.types';
import type { Address } from '@stripe/stripe-js';

export type Order = {
  amount: number;
  currency: string;
  customerId?: string;
  method?: string;
  name?: string;
  email?: string;
  product?: {
    productName: string;
    productId: string;
  };
  plan?: LostPetReportData;
};

export type PurchaseDetail = {
  userName?: string;
  userEmail: string;
  productId: string;
  productType: string;
};

export interface SpeiDetails {
  clabe: string;
  bankName: string;
  reference: string;
  bankCode?: string;
  holderName?: string;
  holderAddress?: Address;
}

export interface OxxoDetails {
  number: string | null;
  expiresAfter: number | null;
  voucherUrl: string | null;
}
