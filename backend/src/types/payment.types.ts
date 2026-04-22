import z from 'zod';

export const paymentDetails = z.object({
  amount: z.number(),
  currency: z.string(),
  customerId: z.string().optional(),
  method: z.string().optional(),
  product: z
    .object({
      productName: z.string(),
      productId: z.string(),
    })
    .optional(),
  plane: z
    .object({
      planType: z.string(),
      duration: z.number(),
      distance: z.number(),
    })
    .optional(),
});

export const purchaseDetails = z.object({
  userEmail: z.string(),
  productId: z.string(),
  productType: z.string(),
});
