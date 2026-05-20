import type { PurchaseRepository } from '@domain/repositories/purchase.repository';
import type { PurchaseDTO } from '@domain/repositories/purchase.repository';
import { PurchaseModel } from '@domain/models/purchase.model';

export const PurchaseDataAccess: PurchaseRepository = {
  /**
   * Create a new purchase record in the database.
   * @param data - Purchase data including user email, payment ID, product ID, and product type
   */
  async createPurchase(data: PurchaseDTO): Promise<void> {
    await PurchaseModel.create({
      ...data,
    });
  },

  /**
   * Get a purchase by its payment ID.
   * @param paymentId - Unique payment identifier associated with the purchase
   * @returns The purchase data if found, otherwise null
   */
  async getByPaymentId(paymentId: string): Promise<PurchaseDTO | null> {
    const purchase = await PurchaseModel.findOne({
      paymentId,
    }).lean();

    if (!purchase) {
      return null;
    }

    return {
      userEmail: purchase.userEmail,
      paymentId: purchase.paymentId,
      productId: purchase.productId,
      productType: purchase.productType,
    };
  },

  /**
   *
   * @param email - To seach all the asociated purchased on this email.
   * @returns The maped DTO.
   */
  async getPurchasesByUserEmail(email: string): Promise<PurchaseDTO[]> {
    const purchases = await PurchaseModel.find({ userEmail: email }).lean();

    return purchases.map((p) => ({
      userEmail: p.userEmail,
      paymentId: p.paymentId,
      productId: p.productId,
      productType: p.productType,
    }));
  },

  /**
   *
   * @param paymentId - To search all the associated purchases for this payment ID.
   * @returns The mapped DTO.
   */
  async getPurchasesByPaymentId(paymentId: string): Promise<PurchaseDTO[]> {
    const purchases = await PurchaseModel.find({ paymentId }).lean();

    return purchases.map((p) => ({
      userEmail: p.userEmail,
      paymentId: p.paymentId,
      productId: p.productId,
      productType: p.productType,
    }));
  },
};
