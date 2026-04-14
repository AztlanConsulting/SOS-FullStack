import * as z from 'zod';

export const workshopQuery = z.object({
  page: z.number(),
  id: z.string(),
});

export const workshopBody = z.object({
  name: z.string().min(1, 'Name required'),
  description: z.string().min(10, 'Description required'),
  price: z.number().min(1, "Price can't be less than 1"),
  category: z.array(z.string()),
});
