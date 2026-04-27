import type { Workshop } from '@domain/models/workshop.model';
import { WorkshopDataAccess } from '@infrastructure/data-access/workshop.data-access';
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
      return res.status(400).json(query.error);
    }

    const { id } = query.data;

    // Get by ID
    if (id != undefined) {
      const ws = await getWorkshopById(WorkshopDataAccess, id);

      if (!ws) {
        return res.status(404).send(`No se encontró el taller con id: ${id}`);
      }

      return res.status(200).json({
        workshops: [ws],
        total: 1,
      });
    }

    // Get with filters
    const { workshops, totalWorkshops } = await getWorkshopList(
      WorkshopDataAccess,
      query.data,
    );

    return res.status(200).json({ workshops, total: totalWorkshops });
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
