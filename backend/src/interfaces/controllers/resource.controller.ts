import { WorkshopDataAccess } from '@infrastructure/data-access/workshop.data-access';
import { ManualDataAccess } from '@infrastructure/data-access/manual.data-access';
import { resourceQuery } from '../../types/resource.types';
import { getResourcesList } from '@use-cases/resources/getResources.usecase';
import type { Request, Response } from 'express';

export async function getResources(req: Request, res: Response) {
  try {
    const query = resourceQuery.safeParse(req.query);

    if (!query.success) {
      return res.status(400).json(query.error);
    }

    const { resources, totalResources } = await getResourcesList(
      WorkshopDataAccess,
      ManualDataAccess,
      query.data,
    );

    return res.status(200).json({ resources, total: totalResources });
  } catch (error) {
    res.status(500).send(error);
  }
}
