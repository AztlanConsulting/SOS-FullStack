export type Order = {
  amount: number;
  currency: string;
  customerId?: string;
  method?: string;
  product?: {
    productName: string;
    productId: string;
  };
  plan?: {
    planType: string;
    duration: number;
    distance: number;
  };
};

export type PurchaseDetail = {
  userEmail: string;
  productId: string;
  productType: string;
};
