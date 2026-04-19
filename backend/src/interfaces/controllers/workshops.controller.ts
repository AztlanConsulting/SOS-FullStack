import type { Workshop } from '@domain/models/workshop.model';
import { WorkshopDataAccess } from '@interfaces/data-access/workshop.data-access';
import { workshopBody, workshopQuery } from '@validation/workshop.types';
import {
  getWorkshopById,
  getWorkshopList,
} from '@use-cases/workshops/getWorkshops.usecase';
import type { Request, Response } from 'express';
import { createWorkshop } from '@use-cases/workshops/createWorkshop.usecase';

export async function getWorkshops(req: Request, res: Response) {
  try {
    const query = workshopQuery.safeParse(req.query);

    if (!query.success) {
      console.error(query.error);
      throw query.error;
    }

    const id = query.data.id;

    let workshops: Workshop[] | Workshop;
    let total: number = 0;
    // Get by ID
    if (id !== undefined) {
      const ws = await getWorkshopById(WorkshopDataAccess, id);
      if (ws) workshops = ws;
      else
        return res.status(404).send(`No se encontró el taller con id: ${id}`);
    }
    // Get with filters
    else {
      const workshopsAndCount = await getWorkshopList(
        WorkshopDataAccess,
        query.data,
      );
      workshops = workshopsAndCount.workshops;
      total = workshopsAndCount.totalWorkshops;
    }

    return res.status(200).json({ workshops, total });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function postWorkshop(req: Request, res: Response) {
  try {
    const body = workshopBody.safeParse(req.body);
    const image = req.file;

    if (!body.success) throw body.error;
    if (image !== undefined && body.data.imageUrl === undefined)
      throw Error('Image not provided');

    // Only fills img if there is a file, unless it uses imageUrl
    const workshopData: Workshop = {
      ...body.data,
      ...() => {
        if (!image) return {};

        return {
          img: {
            data: image.buffer,
            contentType: image.mimetype,
          },
        };
      },
    };

    const workshopId = await createWorkshop(WorkshopDataAccess, workshopData);

    return res.status(200).json({ workshopId });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
