import * as z from 'zod';

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

export type ResourceQuery = z.infer<typeof resourceQuery>;
