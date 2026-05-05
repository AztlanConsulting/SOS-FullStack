export interface PurchaseDTO {
  userEmail: string;
  paymentId: string;
  productId: string;
  productType: string;
}

export interface PurchaseRepository {
  createPurchase(purchaseData: PurchaseDTO): Promise<void>;
  getPurchasesByUserEmail(email: string): Promise<PurchaseDTO[]>;
}
