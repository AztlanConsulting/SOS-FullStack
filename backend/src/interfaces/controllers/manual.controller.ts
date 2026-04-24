import type { Request, Response } from 'express';
import {
  getManualsDB,
  getManualByIdDB,
} from '@use-cases/manuals/getManualsDB.usecase';
import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { manualQuery } from '@/types/manual.types';

export async function getManuals(req: Request, res: Response) {
  try {
    const query = manualQuery.safeParse(req.query);

    if (!query.success) {
      return res.status(400).json(query.error);
    }

    const { id } = query.data;

    // Get by ID
    if (id != undefined) {
      const manual = await getManualByIdDB(ManualDataAccess, id);

      if (!manual) {
        return res.status(404).send(`No se encontró el manual con id: ${id}`);
      }

      return res.status(200).json({
        manuals: [manual],
        total: 1,
      });
    }

    // Get with filters
    const { manuals, totalManuals } = await getManualsDB(
      ManualDataAccess,
      query.data,
    );

    return res.status(200).json({ manuals, total: totalManuals });
  } catch (error) {
    res.status(500).send(error);
  }
}
