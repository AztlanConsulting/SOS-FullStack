import z from 'zod';

export const resourceQuery = z
  .object({
    sortOption: z
      .enum([
        'Nombre (A-Z)',
        'Nombre (Z-A)',
        'Precio: menor a mayor',
        'Precio: mayor a menor',
      ])
      .optional(),
    typeOption: z.enum(['Todos', 'Taller', 'Manual']).optional(),
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

export const resourceSearchQuery = z.object({
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
      z
        .object({
          content: z.string(),
          type: z.string().max(50),
        })
        .refine(
          (item) => {
            if (item.type !== 'image') {
              return item.content.length <= 400;
            }
            return true;
          },
          {
            message: 'Non-image content must be at most 400 characters',
            path: ['content'],
          },
        ),
    )
    .max(10),
});

export const updateResourceSchema = resourceSchema.partial();

export type ResourceQuery = z.infer<typeof resourceQuery>;
