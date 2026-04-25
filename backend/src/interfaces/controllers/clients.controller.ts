import type { Request, Response } from 'express';
import { createLostPetReport } from '../../use-cases/clients/createLostPetReport.usecase';
import { publishLostPet } from '../../use-cases/clients/publishLostPet.usecase';
import { metaPublisher } from '../../infrastructure/api/meta.api';
import {
  createPetReportDTOSchema,
  getCreatePetReportFieldErrors,
} from '../../types/clients.type';

const publishPet = async (req: Request, res: Response) => {
  try {
    const { caption, mediaUrl } = req.body;

    const result = await publishLostPet(metaPublisher, {
      imageUrl: mediaUrl,
      caption,
    });

    res.json({
      message: 'Successfully published to Facebook and Instagram',
      data: result,
    });
  } catch (err: unknown) {
    console.error(err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error: 'Error publishing to social media',
      details: errorMessage,
    });
  }
};

const createLostPetReportController = async (req: Request, res: Response) => {
  try {
    const images = req.files as Express.Multer.File[] | undefined;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos una imagen' });
    }

    const validation = createPetReportDTOSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: getCreatePetReportFieldErrors(validation.error),
      });
    }

    const result = await createLostPetReport(validation.data);

    return res.status(201).json({
      message: 'Reporte creado exitosamente',
      data: result,
    });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    return res.status(500).json({
      error: 'Error creando el reporte de mascota',
      details: errorMessage,
    });
  }
};

export default {
  publishPet,
  createLostPetReportController,
};
