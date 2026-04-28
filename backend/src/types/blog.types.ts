import * as z from 'zod';

export const blogQuery = z
  .object({
    sortOption: z.string().optional(),
    page: z.coerce.number().optional(),
    searchTerm: z.string().optional(),
    id: z.string().optional(),
  })
  .refine((data) => data.page !== undefined || data.id !== undefined, {
    message: "Error: 'page' or 'id' must be defined",
    path: ['page'],
  });
