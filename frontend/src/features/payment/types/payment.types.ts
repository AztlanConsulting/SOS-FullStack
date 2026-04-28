import type { PetReportData } from '@/features/users/types/petReport.types';

export type Order = {
  amount: number;
  currency: string;
  customerId?: string;
  method?: string;
  product?: {
    productName: string;
    productId: string;
  };
  plan?: PetReportData;
};

export type PurchaseDetail = {
  userEmail: string;
  productId: string;
  productType: string;
};
