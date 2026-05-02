import type { Request, Response } from 'express';
import type { TokenPayload } from '@/types/auth.types';
import { createLostPetReport } from '@use-cases/clients/createLostPetReport.usecase';
import { publishLostPet } from '@use-cases/clients/publishLostPet.usecase';
import { metaPublisher } from '@infrastructure/api/meta.api';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { petDataAccess } from '@infrastructure/data-access/pet.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { roleDataAccess } from '@/infrastructure/data-access/role.data-access';
import { getPlanProgress } from '@use-cases/clients/getPlanProgress.usecase';
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

    const imageUrls = images.map((file) => {
      return `${process.env.BASE_URL}/uploads/${file.filename}`;
    });

    const result = await createLostPetReport(
      {
        userRepository: userDataAccess,
        petRepository: petDataAccess,
        purchasedPlanRepository: purchasedPlanDataAccess,
        roleRepository: roleDataAccess,
      },
      {
        ...validation.data,
        images: imageUrls,
      },
    );

    return res.status(201).json({
      message: 'Reporte creado exitosamente',
      data: result,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    return res.status(500).json({
      error: 'Error creando el reporte de mascota',
      details: errorMessage,
    });
  }
};

export const getPlanProgressController = async (
  req: Request,
  res: Response,
) => {
  try {
    const reqWithUser = req as Request & { user?: TokenPayload };
    const userId = reqWithUser.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'No autorizado: Usuario no encontrado en el token' });
    }

    const result = await getPlanProgress(
      {
        petRepository: petDataAccess,
        purchasedPlanRepository: purchasedPlanDataAccess,
      },
      userId.toString(),
    );

    if (!result) {
      return res.status(200).json(null);
    }

    return res.status(200).json(result);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Error desconocido';
    return res.status(500).json({
      message: 'Error al obtener el progreso del plan',
      details: errorMessage,
    });
  }
};

export default {
  publishPet,
  createLostPetReportController,
  getPlanProgressController,
};
