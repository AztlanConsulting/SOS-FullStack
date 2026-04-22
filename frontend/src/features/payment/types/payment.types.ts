import type { PlanDetails } from '@features/plans/types/plan.types';

export type Order = {
  amount: number;
  currency: string;
  customerId?: string;
  method?: string;
  product?: {
    productName: string;
    productId: string;
  };
  plan?: PlanDetails;
};

export type PurchaseDetail = {
  userEmail: string;
  productId: string;
  productType: string;
};
