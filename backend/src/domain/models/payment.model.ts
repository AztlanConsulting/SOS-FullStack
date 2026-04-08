import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
  {
    stripeId: String,
    amount: Number,
    currency: String,
    status: String,
    clientSecret: String,
  },
  { timestamps: true },
);

export const PaymentModel = model('Payment', paymentSchema);
