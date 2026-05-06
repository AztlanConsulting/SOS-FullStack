import React, { useEffect, useState } from 'react';
import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import { getActiveLostPetReportRequest } from '@/features/users/services/lostPet.service';

export const AdProgressSection = () => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const report = await getActiveLostPetReportRequest();
        if (report && report.posterImageUrl) {
          setPosterUrl(
            `${import.meta.env.VITE_API_URL}${report.posterImageUrl}`,
          );
        }
      } catch (error) {
        console.error('Error al obtener el póster:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoster();
  }, []);

  if (isLoading) {
    return (
      <Text variant="body" className="text-center mt-4">
        Cargando póster...
      </Text>
    );
  }

  if (!posterUrl) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <Text variant="body" weight="bold" className="text-2xl mb-4">
        Póster de tu Mascota
      </Text>

      <div className="w-full max-w-md overflow-hidden rounded-lg shadow-md bg-[#F9F1DE] mb-6">
        <img
          src={posterUrl}
          alt="Póster de mascota perdida"
          className="w-full h-auto object-cover"
        />
      </div>

      <a
        href={posterUrl}
        download="poster_mascota.jpg"
        target="_blank"
        rel="noreferrer"
      >
        <Button label="Descargar Póster" variant="primary" onClick={() => {}} />
      </a>
    </div>
  );
};
