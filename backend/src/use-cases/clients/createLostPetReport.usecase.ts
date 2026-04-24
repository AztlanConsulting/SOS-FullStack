import type {
  CreatePetReportDTO,
  LostPetReport,
} from '../../types/clients.type';

export const createLostPetReport = async (
  reportData: CreatePetReportDTO | LostPetReport,
) => {
  const id = `lost_pet_${Date.now()}`;

  return {
    id,
    status: 'Buscando' as const,
    createdAt: new Date(),
    ...reportData,
  };
};
