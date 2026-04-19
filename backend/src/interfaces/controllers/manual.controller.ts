import type { Request, Response } from 'express';
import { getManualsDB } from '@use-cases/manuals/getManualsDB.usecase';
import { getManualByIdDB } from '@use-cases/manuals/getManualByIdDB.usecase';
import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { manualQuery } from '@/types/manual.types';
import type { ManualResult } from '@/domain/repositories/manual.repository';

/**
 * Factory function that creates an Express middleware for retrieving manuals.
 * Handles both list queries (with pagination and filtering) and individual manual lookups by ID.
 * Validates request parameters using Zod schema validation before processing.
 * @returns Express middleware function (req: Request, res: Response) that processes manual retrieval requests
 */

export const makeGetManuals = () => {
  return async (req: Request, res: Response) => {
    try {
      const query = manualQuery.safeParse(req.query);

      if (!query.success) {
        console.error(query.error);
        throw query.error;
      }

      const id = query.data.id;

      let manuals: ManualResult[];
      let total: number = 0;
      if (id !== undefined) {
        const mu = await getManualByIdDB(ManualDataAccess, id);
        if (mu) manuals = [mu];
        else return res.status(404).send(`No manual found with id: ${id}`);
      } else {
        const manualsAndCount = await getManualsDB(
          ManualDataAccess,
          query.data,
        );
        manuals = manualsAndCount.manuals;
        total = manualsAndCount.totalManuals;
      }

      return res.status(200).json({ manuals, total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  };
};
