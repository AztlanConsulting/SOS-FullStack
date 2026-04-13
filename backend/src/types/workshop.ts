import * as z from 'zod';

export const workshopQuery = z.object({
  page: z.number(),
  id: z.string(),
});
