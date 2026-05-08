import type { LostPetReportData } from '@/shared/types/petReport.types';

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
