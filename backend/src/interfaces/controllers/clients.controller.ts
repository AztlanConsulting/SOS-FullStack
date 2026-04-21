import type { Request, Response } from 'express';
import { createLostPetReport } from '../../use-cases/clients/createLostPetReport.usecase';
import { publishLostPet } from '../../use-cases/clients/publishLostPet.usecase';
import { metaPublisher } from '../../infrastructure/api/meta.api';
import { z } from 'zod';

const createPetReportDTOSchema = z.object({
  name: z.string().optional(),
  species: z.string().min(1, 'La especie es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  breed: z.string().optional(),
  sex: z.enum(['Macho', 'Hembra', 'Desconocido']),
  color: z.string().min(1, 'El color es requerido'),
  size: z.string(),
  description: z.string().min(1, 'La descripción es requerida'),
  location: z.string().optional(),
  locationCoords: z.preprocess(
    (val) => (typeof val === 'string' ? JSON.parse(val) : val),
    z.tuple([z.number(), z.number()]),
  ),
  contactName: z.string().min(1, 'El nombre de contacto es requerido'),
  phoneNumber: z.string().min(1, 'El número de teléfono es requerido'),
  email: z.email('El correo electrónico no es válido'),
});

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

export type CreatePetReportDTO = z.infer<typeof createPetReportDTOSchema>;

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
        details: validation.error.flatten().fieldErrors,
      });
    }

    const result = await createLostPetReport(validation.data, images);

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
