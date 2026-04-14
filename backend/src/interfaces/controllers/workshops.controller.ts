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
      throw Error("Couldn't parse page or id");
    }

    const page = query.data.page;
    const id = query.data.id;

    let workshops: Workshop[];
    if (id) {
      const ws = await getWorkshopById(WorkshopDataAccess, id);
      workshops = ws ? [ws] : [];
    } else workshops = await getWorkshopList(WorkshopDataAccess, page);

    return res.status(200).json(workshops);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function postWorkshop(req: Request, res: Response) {
  try {
    const body = workshopBody.safeParse(req.body);
    const image = req.file;

    if (!body.success) throw body.error;
    if (!image && !body.data.imgUrl) throw Error('Image not provided');

    // Only fills img if there is a file, unless it uses imgUrl
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
    return res.status(500).send('Error uploading workshop');
  }
}
