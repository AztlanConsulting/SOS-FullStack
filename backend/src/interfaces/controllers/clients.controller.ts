import type { Request, Response } from 'express';
import type { TokenPayload } from '@/types/auth.types';
import type { DashboardResponse } from '@validation/clients.type';

import { createLostPetReport } from '@use-cases/clients/createLostPetReport.usecase';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { petDataAccess } from '@infrastructure/data-access/pet.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { roleDataAccess } from '@/infrastructure/data-access/role.data-access';

import {
  createPetReportDTOSchema,
  getCreatePetReportFieldErrors,
} from '../../types/clients.type';
import { getPlanProgress } from '@/use-cases/clients/getPlanProgress.usecase';
import { getUploadUrl } from '@/utils/uploadUrl.utils';

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

    const imageUrls = images.map((file) => getUploadUrl(req, file.filename));

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
    console.error(err);
    return res.status(500).json({
      error: 'Error creando el reporte de mascota',
      details: errorMessage,
    });
  }
};

export const getDashboardController = async (req: Request, res: Response) => {
  try {
    const reqWithUser = req as Request & { user?: TokenPayload };
    const userId = reqWithUser.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'No autorizado: Credenciales incompletas en el token.',
      });
    }

    const planProgress = await getPlanProgress(
      {
        petRepository: petDataAccess,
        purchasedPlanRepository: purchasedPlanDataAccess,
      },
      userId.toString(),
    );

    const dashboardData: DashboardResponse = {
      planProgress,
    };

    return res.status(200).json(dashboardData);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Error desconocido';
    return res.status(500).json({
      message: 'Error al cargar los datos del dashboard',
      details: errorMessage,
    });
  }
};

export default {
  createLostPetReportController,
  getDashboardController,
};
