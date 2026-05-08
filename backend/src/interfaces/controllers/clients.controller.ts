import type { Request, Response } from 'express';
import { createLostPetReport } from '@use-cases/clients/createLostPetReport.usecase';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { petDataAccess } from '@infrastructure/data-access/pet.data-access';
import { purchasedPlanDataAccess } from '@infrastructure/data-access/purchasedPlan.data-access';
import { roleDataAccess } from '@/infrastructure/data-access/role.data-access';
import {
  createPetReportDTOSchema,
  getCreatePetReportFieldErrors,
} from '../../types/clients.type';

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
    console.error(err);
    return res.status(500).json({
      error: 'Error creando el reporte de mascota',
      details: errorMessage,
    });
  }
};

export default { createLostPetReportController };
