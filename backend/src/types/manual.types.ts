import * as z from 'zod';

export const manualQuery = z
  .object({
    sortOption: z
      .enum([
        'Nombre (A-Z)',
        'Nombre (Z-A)',
        'Precio: menor a mayor',
        'Precio: mayor a menor',
      ])
      .optional(),
    page: z.coerce.number().optional(),
    searchTerm: z.string().optional(),
    id: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.page !== undefined && data.sortOption !== undefined) ||
      data.id !== undefined,
    {
      message: "Error: 'page' or 'id' must be defined",
      path: ['page'],
    },
  );

export const ContentBlockZodSchema = z.object({
  content: z.string(),
  type: z.string(),
});

export const manualBody = z.object({
  name: z.string().min(1, 'Name required'),
  price: z.coerce.number().min(1, "Price can't be less than 1"),
  content: z.array(ContentBlockZodSchema),
  imageUrl: z.string().optional(),
});
