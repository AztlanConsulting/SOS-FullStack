import type { Request, Response } from 'express';
import logger from '@/utils/logger';
import { z } from 'zod';
import { PetModel } from '@domain/models/pet.model';

const petNotesSchema = z.object({
  notes: z.string().max(600).optional(),
  publicNote: z
    .object({
      text: z.string().max(600).optional(),
      image: z.string().optional(),
    })
    .optional(),
});

export const PetController = {
  /**
   * PATCH /pets/:id/notes
   * Updates notes and/or publicNote for a specific pet.
   */
  updatePetNotes: async (req: Request, res: Response): Promise<void> => {
    try {
      const petId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!petId || typeof petId !== 'string') {
        res.status(400).json({ error: 'Invalid pet id' });
        return;
      }

      const body = petNotesSchema.safeParse(req.body);
      if (!body.success) {
        res.status(400).json({ error: body.error });
        return;
      }

      await PetModel.findByIdAndUpdate(petId, { $set: body.data });
      res.status(200).json({ message: 'Pet notes updated successfully' });
    } catch (error) {
      logger.error('updatePetNotes error', { error, petId: req.params.id });
      res.status(500).json({ error: 'Error updating pet notes' });
    }
  },
};
