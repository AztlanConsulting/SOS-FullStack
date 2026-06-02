import z from 'zod';

export const resourceQuery = z.object({
  resource: z.string().max(20).optional(),
});

export const resourceSchema = z.object({
  _id: z.string().max(100),
  name: z.string().max(100),
  price: z.number(),
  imageUrl: z.string().max(200),
  resourceUrl: z.string().max(200),
  emailContent: z.string().max(400).optional(),
  content: z
    .array(
      z.object({
        content: z.string().max(400),
        type: z.string().max(50),
      }),
    )
    .max(10),
});

export const updateResourceSchema = resourceSchema.partial();
