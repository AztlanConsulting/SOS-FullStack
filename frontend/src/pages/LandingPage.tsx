import Header from '../shared/components/layout/Header';
import HeroSection from '../features/landing/components/landingPage/HeroSection';
import ServicesSection from '../features/landing/components/landingPage/ServicesSection';
import PlansSection from '../features/landing/components/landingPage/PlansSection';
import PublicationSection from '../features/landing/components/landingPage/PublicationSection';
import PetInfoSection from '../features/landing/components/landingPage/PetInfoSection';
import TestimonialsSection from '../features/landing/components/landingPage/TestimonialsSection';
import Footer from '../shared/components/layout/Footer';
import FrecuentlyAsked from '@features/landing/components/landingPage/FrecuentlyAsked';
import {
  exportPosterAsImage,
  exportPosterAsPdfColor,
  exportPosterAsPdfBlackAndWhite,
} from '@shared/services/posterExport.services';

import husky1 from '@assets/images/husky1.jpg';
import husky2 from '@assets/images/husky2.jpg';
import husky3 from '@assets/images/husky3.jpg';
import husky4 from '@assets/images/husky4.jpg';
import { Poster } from '@/features/poster/components/Poster.component';
import { useRef, useEffect, useState } from 'react';
import type { PetReportData } from '@/features/poster/types/petReportData.types';

// Temporary utility to convert image URLs to File objects for testing purposes.
const urlToFile = async (url: string, filename: string): Promise<File> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const LandingPage = () => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [petData, setPetData] = useState<PetReportData | null>(null);

  useEffect(() => {
    // Simulate fetching pet report data and converting image URLs to File objects.
    const initializePetData = async () => {
      const file3 = await urlToFile(husky1, 'husky1.jpg');
      const file4 = await urlToFile(husky2, 'husky2.jpg');
      const file5 = await urlToFile(husky3, 'husky3.jpg');

      const mockPetReportData: PetReportData = {
        name: 'Travieso',
        species: 'Perro',
        date: '2026-04-23',
        breed: 'Mixto de husky y galgo italinno y shitzu',
        sex: 'Macho',
        color: 'Es blanco y negro y 3 manchas amarillas.',
        size: 'Mediana: 11 a 25 kg',
        description:
          'Es amigable pero puede estar asustado. Tiene una mancha café en la oreja izquierda y llevaba collar.',
        images: [file3, file4, file5],
        imageLayout: '3',
        address:
          'Tertiary Road Lateral Bernardo Quintana, Residencial Bellavista, Delegación Epigmenio González, Querétaro, Municipio de Querétaro, Querétaro, 73130, Mexico',
        location: {
          coords: [-100.3899, 20.5888],
          displayName: 'Rancho Nuevo, Querétaro, México',
        },
        locationCoords: [-100.3899, 20.5888],
        contactName: 'Juan Pérez',
        phoneNumber: '+52 442 123 4567',
        email: 'juan.perez@email.com',
      };

      setPetData(mockPetReportData);
    };

    initializePetData();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[72px] lg:pt-0">
        <HeroSection />
        <ServicesSection />
        <PlansSection />
        <PublicationSection />
        <TestimonialsSection />
        <PetInfoSection />
        <FrecuentlyAsked />

        {petData && (
          <>
            <div className="w-[432px] h-[540px] mx-auto my-10 overflow-hidden">
              <div className="scale-40 origin-top-left">
                <Poster ref={posterRef} pet={petData} />
              </div>
            </div>
            <button
              onClick={() =>
                exportPosterAsImage(posterRef.current, `${petData.name}-poster`)
              }
              className="border"
            >
              Descargar Imagen
            </button>

            <button
              onClick={() =>
                exportPosterAsPdfColor(
                  posterRef.current,
                  `${petData.name}-poster`,
                )
              }
              className="border"
            >
              Descargar PDF Color
            </button>

            <button
              onClick={() =>
                exportPosterAsPdfBlackAndWhite(
                  posterRef.current,
                  `${petData.name}-poster`,
                )
              }
              className="border"
            >
              Descargar PDF Black and White
            </button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
