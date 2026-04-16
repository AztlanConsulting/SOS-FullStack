import * as z from 'zod';

export const workshopQuery = z.object({
  page: z.coerce.number(),
  id: z.string().optional(),
});

export const workshopBody = z.object({
  name: z.string().min(1, 'Name required'),
  description: z.string().min(10, 'Description required'),
  price: z.coerce.number().min(1, "Price can't be less than 1"),
  content: z.string(),
  category: z.array(z.string()),
  imageUrl: z.string().optional(),
});
