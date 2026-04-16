import type { Request, Response } from 'express';
import { getManualsDB } from '@use-cases/manuals/getManualsDB.usecase';
import { getManualByIdDB } from '@use-cases/manuals/getManualByIdDB.usecase';
import { ManualDataAccess } from '@interfaces/data-access/manual.data-access';
import { manualQuery } from '@/types/manual.types';
import { IManual } from '@/domain/models/manual.model';
import type { ManualResult } from '@/domain/repositories/manual.repository';

/**
 * Factory function that returns a middleware to retrieve all manuals.
 * @returns Express middleware handler that fetches and returns all manuals
 */
export const makeGetManuals = () => {
  return async (req: Request, res: Response) => {
    try {
      const query = manualQuery.safeParse(req.query);

      if (!query.success) {
        console.error(query.error);
        throw query.error;
      }
      console.log(req.query);

      const page = query.data.page;
      const id = query.data.id;

      let manuals: ManualResult[];
      let total: number = 0;
      if (id !== undefined) {
        const mu = await getManualByIdDB(ManualDataAccess, id);
        manuals = mu ? [mu] : [];
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
