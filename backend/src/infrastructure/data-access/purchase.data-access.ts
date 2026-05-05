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
};
