import { useState, useEffect } from 'react';
import { getActiveLostPetReportRequest } from '@/features/users/services/lostPet.service';
import { urlToFile } from '@/shared/utils/fileUtils';
import type { LostPetReportData } from '@/shared/types/petReport.types';

export const useActivePetReport = () => {
  const [petData, setPetData] = useState<LostPetReportData | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndMapPetData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const rawReport = await getActiveLostPetReportRequest();

        if (
          rawReport &&
          rawReport.pet &&
          rawReport.pet.photos &&
          rawReport.pet.photos.length > 0
        ) {
          const baseUrl =
            import.meta.env.VITE_API_URL || 'http://localhost:3000';

          const photosArray = [...rawReport.pet.photos];
          const rawPosterUrl = photosArray.pop();

          const finalPosterUrl = rawPosterUrl?.startsWith('http')
            ? rawPosterUrl
            : `${baseUrl}${rawPosterUrl}`;

          setPosterUrl(finalPosterUrl || null);

          const filePromises = photosArray.map(
            async (photoPath: string, index: number) => {
              const fullUrl = photoPath.startsWith('http')
                ? photoPath
                : `${baseUrl}${photoPath}`;
              const fileName =
                photoPath.split('/').pop() || `foto_${index}.jpg`;
              return await urlToFile(fullUrl, fileName, 'image/jpeg');
            },
          );

          const imageFiles = await Promise.all(filePromises);
          const layoutNumber =
            imageFiles.length > 4 ? '4' : imageFiles.length.toString();

          const mappedData: LostPetReportData = {
            name: rawReport.pet.name,
            species: rawReport.pet.species,
            date: new Date(rawReport.pet.dateMissing).toLocaleDateString(
              'es-MX',
            ),
            breed: rawReport.pet.breed || 'Mestizo',
            sex: rawReport.pet.sex,
            color: rawReport.pet.color,
            size: rawReport.pet.size,
            description: rawReport.pet.description,
            address: rawReport.pet.placeMissing,
            location: null,
            images: imageFiles,
            imageLayout: layoutNumber,
            contactName: rawReport.contactName || '',
            phoneNumber: rawReport.phoneNumber || '',
            email: rawReport.email || '',
            planName: 'Plan Activo',
          };

          setPetData(mappedData);
        }
      } catch (err: unknown) {
        console.error('Error cargando la información del póster:', err);
        setError(
          err instanceof Error ? err.message : 'Error al obtener el reporte',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndMapPetData();
  }, []);

  return { petData, posterUrl, isLoading, error };
};
