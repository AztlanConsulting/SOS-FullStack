import { createPetImage } from '@use-cases/images/createPetImage';
import type { LostPetReport } from '@domain/models/lostPet.model';
import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';

export const createLostPetReport = async (
  petData: LostPetReport,
  images: Express.Multer.File[] | undefined,
) => {
  const reportId = `lost_pet_${Date.now()}`;

  const savedReport = {
    id: reportId,
    ...petData,
    status: 'Buscando',
    createdAt: new Date(),
    imagesUploaded: false,
  };

  if (images && images.length > 0) {
    try {
      const uploadPromises = images.map((img) =>
        createPetImage(petVector, {
          refId: reportId,
          image: img.buffer,
          species: petData.species,
        }),
      );

      await Promise.all(uploadPromises);
      savedReport.imagesUploaded = true;
    } catch (error) {
      console.error('⚠️ Error subiendo imágenes a la BD Vectorial:', error);
    }
  }

  return savedReport;
};
