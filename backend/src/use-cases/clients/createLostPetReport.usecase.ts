import fs from 'fs/promises';
import path from 'path';
import { petVector } from '@infrastructure/data-access/vectorDB/petVector.data-access';
import { createPetImage } from '@use-cases/images/createPetImage';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { petDataAccess } from '@/infrastructure/data-access/pet.data-access';
import type { CreatePetReportDTO } from '@interfaces/controllers/clients.controller';
import { RoleModel } from '@domain/models/role.model';

export const createLostPetReport = async (
  reportData: CreatePetReportDTO,
  images: Express.Multer.File[] | undefined,
) => {
  let user = await userDataAccess.getUserByEmail(reportData.email);

  if (!user) {
    const clientRole = await RoleModel.findOne({ role: 'client' }).lean();

    if (!clientRole) {
      throw new Error('No se encontró el rol de cliente en la base de datos.');
    }

    user = (await userDataAccess.createUser({
      email: reportData.email,
      username: reportData.email.split('@')[0],
      password: Math.random().toString(36).slice(-8),
      phone: reportData.phoneNumber,
      roleId: clientRole._id as any,
      active: true,
    })) as any;
  }

  const localImageUrls: string[] = [];
  const uploadDir = path.join(__dirname, '../../../../public/uploads');

  await fs.mkdir(uploadDir, { recursive: true });

  if (images && images.length > 0) {
    for (const img of images) {
      const fileName = `pet_${Date.now()}_${Math.round(Math.random() * 1e5)}.jpg`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, img.buffer);

      localImageUrls.push(`/uploads/${fileName}`);
    }
  }

  const newPet = await petDataAccess.createPet({
    userId: user!._id.toString(),
    name: reportData.name,
    species: reportData.species,
    dateMissing: new Date(reportData.date),
    breed: reportData.breed,
    sex: reportData.sex,
    color: reportData.color,
    size: reportData.size,
    description: reportData.description,
    placeMissing: reportData.location,
    photos: localImageUrls,
  });

  if (images && images.length > 0) {
    try {
      const uploadPromises = images.map((img) =>
        createPetImage(petVector, {
          refId: newPet._id!.toString(),
          image: img.buffer,
          species: reportData.species,
        }),
      );
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error subiendo imágenes a la BD Vectorial:', error);
    }
  }

  return {
    user: { id: user!._id, email: user!.email },
    pet: newPet,
  };
};
