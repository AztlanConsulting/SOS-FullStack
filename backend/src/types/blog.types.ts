import { Blog } from '@/domain/models/blog.model';
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

export const blogSchema = z.object({
  name: z.string().max(120, 'Name is too long').min(1, "Name can't be blank"),
  duration: z.coerce.number().default(1),
  content: z.array(
    z.object({
      content: z.string(),
      type: z.string(),
    }),
  ),
  imageUrl: z.string(),
});

export const editBlogSchema = blogSchema.partial();
