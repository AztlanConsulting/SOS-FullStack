import * as z from 'zod';

export const manualQuery = z.object({
  page: z.coerce.number().default(1),
  id: z.string().optional(),
});

export const manualBody = z.object({
  name: z.string().min(1, 'Name required'),
  price: z.coerce.number().min(1, "Price can't be less than 1"),
  content: z.string().min(10, 'Content required'),
  imageUrl: z.string().optional(),
});
