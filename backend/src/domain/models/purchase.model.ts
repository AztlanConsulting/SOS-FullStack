import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface IPurchase extends Document {
  userEmail: string;
  paymentId: string;
  productId: string;
  productType: string;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    userEmail: { type: String, required: true },
    paymentId: { type: String, required: true },
    productId: { type: String, required: true },
    productType: { type: String, required: true },
  },
  { timestamps: true },
);

export const PurchaseModel = model<IPurchase>('Purchase', purchaseSchema);
