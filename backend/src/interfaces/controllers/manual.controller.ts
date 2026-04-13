import type { Request, Response } from 'express';
import { getManualsDB } from '../../use-cases/manuals/getManualsDB.usecase';
import { getManualByIdDB } from '../../use-cases/manuals/getManualByIdDB.usecase';

export const makeGetManuals = () => {
  return async (req: Request, res: Response) => {
    try {
      const manuals = await getManualsDB();
      res.json(manuals);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Failed to fetch manuals';
      res.status(500).json({ error: message });
    }
  };
};

export const makeGetManualById = () => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const manual = await getManualByIdDB(id);
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
