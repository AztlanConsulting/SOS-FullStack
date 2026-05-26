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
  plan: z.any().optional(),
  extensionPlan: z
    .object({
      petId: z.string(),
      name: z.string(),
      price: z.number(),
      duration: z.number(),
      radius: z.number(),
      features: z.array(z.string()),
    })
    .optional(),
});

export const purchaseDetailsSchema = z
  .object({
    planId: z.string().nullable(),
    purchaseDetails: z.object({
      userEmail: z.string(),
      productId: z.string().optional(),
      productType: z.string(),
    }),
    extensionPlan: z
      .object({
        petId: z.string(),
        name: z.string(),
        price: z.number(),
        duration: z.number(),
        radius: z.number(),
        features: z.array(z.string()),
      })
      .optional(),
  })
  .refine(
    (data) =>
      Boolean(data.planId) || Object.keys(data.purchaseDetails).length > 0,
    {
      message: 'Error, either planId or purchaseDetails should be defined',
      path: ['capture-order'],
    },
  );
