import type { Request, Response } from 'express';
import type { TokenPayload } from '@/types/auth.types';
import type { DashboardResponse } from '@validation/clients.type';

import { createLostPetReport } from '@use-cases/clients/createLostPetReport.usecase';
import { publishLostPet } from '@use-cases/clients/publishLostPet.usecase';
import { metaPublisher } from '@infrastructure/api/meta.api';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { petDataAccess } from '@infrastructure/data-access/pet.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { roleDataAccess } from '@/infrastructure/data-access/role.data-access';
import { PurchaseDataAccess } from '@/infrastructure/data-access/purchase.data-access';
import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';

import {
  createPetReportDTOSchema,
  getCreatePetReportFieldErrors,
} from '../../types/clients.type';
import { getPlanProgress } from '@/use-cases/clients/getPlanProgress.usecase';
import { getPurchasedResources } from '@/use-cases/clients/getPurchasedResources.usecase';

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

export const getDashboardController = async (req: Request, res: Response) => {
  try {
    const reqWithUser = req as Request & { user?: TokenPayload };
    const userId = reqWithUser.user?.userId;
    const userEmail = reqWithUser.user?.email;

    if (!userId || typeof userEmail !== 'string' || userEmail.trim() === '') {
      return res.status(401).json({
        message: 'No autorizado: Credenciales incompletas en el token.',
      });
    }

    const [planProgress, resources] = await Promise.all([
      getPlanProgress(
        {
          petRepository: petDataAccess,
          purchasedPlanRepository: purchasedPlanDataAccess,
        },
        userId.toString(),
      ),
      getPurchasedResources(
        {
          purchaseRepository: PurchaseDataAccess,
          manualRepository: ManualDataAccess,
          workshopRepository: WorkshopDataAccess,
        },
        userEmail,
      ),
    ]);

    const dashboardData: DashboardResponse = {
      planProgress,
      resources,
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
  publishPet,
  createLostPetReportController,
  getDashboardController,
};
