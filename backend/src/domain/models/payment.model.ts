import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface IPayment extends Document {
  stripeId: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    stripeId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    clientSecret: { type: String, required: true },
  },
  { timestamps: true },
);

export const PaymentModel = model<IPayment>('Payment', paymentSchema);
