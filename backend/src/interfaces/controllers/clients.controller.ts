import type { Request, Response } from 'express';
import { createLostPetReport } from '../../use-cases/clients/createLostPetReport.usecase';
import type { LostPetReport } from '../../domain/models/lostPet.model';
import { publishLostPet } from '../../use-cases/clients/publishLostPet.usecase';
import { metaPublisher } from '../../infrastructure/api/meta.api';
import { z } from 'zod';

const lostPetReportSchema = z.object({
  name: z.string().optional(),
  species: z.string().min(1, 'La especie es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  breed: z.string().optional(),
  sex: z.enum(['Macho', 'Hembra', 'Desconocido'], {
    error: 'El sexo debe ser Macho, Hembra o Desconocido',
  }),
  color: z.string().min(1, 'El color es requerido'),
  size: z.enum(
    [
      'Mini: 1 a 4 kg',
      'Pequeña: 5 a 10 kg',
      'Mediana: 11 a 25 kg',
      'Grande: 26 a 45 kg',
      'Gigante: más de 45 kg',
    ],
    {
      error: 'La talla seleccionada no es válida',
    },
  ),
  description: z.string().min(1, 'La descripción es requerida'),
  location: z.string().optional(),
  locationCoords: z.tuple([z.coerce.number(), z.coerce.number()]).optional(),
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

const createLostPetReportController = async (req: Request, res: Response) => {
  try {
    const petData: LostPetReport = req.body;

    const images = req.files as Express.Multer.File[] | undefined;

    if (!images || images.length === 0) {
      return res.status(400).json({
        error: 'No pictures provided',
        details: 'Se requiere al menos una imagen de la mascota perdida',
      });
    }

    const validation = lostPetReportSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: validation.error.flatten().fieldErrors,
      });
    }

    const result = await createLostPetReport(petData, images);

    return res.status(201).json({
      message: 'Reporte de mascota perdida creado exitosamente',
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
