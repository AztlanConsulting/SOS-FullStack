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
  plan: z.unknown().optional(),
});

export const purchaseDetailsSchema = z
  .object({
    planId: z.string().nullable(),
    purchaseDetails: z.object({
      userEmail: z.string(),
      productId: z.string().optional(),
      productType: z.string(),
    }),
  })
  .refine(
    (data) =>
      Boolean(data.planId) || Object.keys(data.purchaseDetails).length > 0,
    {
      message: 'Error, either planId or purchaseDetails should be defined',
      path: ['capture-order'],
    },
  );
