import type { Workshop } from '@domain/models/workshop.model';
import { WorkshopDataAccess } from '@interfaces/data-access/workshop.data-access';
import { workshopQuery } from '@validation/workshop';
import {
  getWorkshopById,
  getWorkshopList,
} from '@use-cases/workshops/getWorkshops.usecase';
import type { Request, Response } from 'express';

export async function getWorkshops(req: Request, res: Response) {
  try {
    const query = workshopQuery.safeParse(req.query);

    if (!query.success) {
      throw Error("Couldn't parse page or id");
    }

    const page = query.data.page;
    const id = query.data.id;

    let workshops: Workshop[];
    if (id) workshops = [await getWorkshopById(WorkshopDataAccess, id)];
    else workshops = await getWorkshopList(WorkshopDataAccess, page);

    return res.status(200).json(workshops);
  } catch (error) {
    res.status(500).send(error);
  }
}
