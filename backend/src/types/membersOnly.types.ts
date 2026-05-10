import * as z from 'zod';

export const membersOnlyQuery = z
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

export const membersOnlyBody = z.object({
  name: z.string().min(1, 'Name is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Image is required'),
  pdf: z.string().min(1, 'PDF is required'),
});
