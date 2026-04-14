import type { Request, Response } from 'express';
import { getManualsDB } from '@use-cases/manuals/getManualsDB.usecase';
import { getManualByIdDB } from '@use-cases/manuals/getManualByIdDB.usecase';
import { ManualDataAccess } from '@interfaces/data-access/manual.data-access';

/**
 * Factory function that returns a middleware to retrieve all manuals.
 * @returns Express middleware handler that fetches and returns all manuals
 */
export const makeGetManuals = () => {
  return async (req: Request, res: Response) => {
    try {
      const manuals = await getManualsDB(ManualDataAccess);
      res.json(manuals);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Failed to fetch manuals';
      res.status(500).json({ error: message });
    }
  };
};

/**
 * Factory function that returns a middleware to retrieve a manual by ID.
 * @returns Express middleware handler that fetches a manual by its ID from request params
 */
export const makeGetManualById = () => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const manual = await getManualByIdDB(ManualDataAccess, id);
      if (!manual) {
        return res.status(404).json({ error: 'Manual not found' });
      } else {
        res.json(manual);
      }
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Failed to fetch manual';
      res.status(500).json({ error: message });
    }
  };
};
