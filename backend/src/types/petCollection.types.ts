import z from 'zod';

export const countPetCollectionParams = z.object({
  color: z.string(),
  location: z.string(),
  species: z.string(),
});

export const petCollectionParams = z.object({
  page: z.coerce.number(),
  color: z.string(),
  location: z.string(),
  species: z.string(),
});
