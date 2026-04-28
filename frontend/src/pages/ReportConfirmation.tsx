import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { DataConfirmation } from '../features/users/components/DataConfirmation';
import { usePetReport } from '../features/users/context/PetReportContext';

import Header from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import { Poster } from '@/features/poster/components/Poster.component';

export const ReportConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportData, setReportData } = usePetReport();
  const posterRef = useRef<HTMLDivElement>(null);
  // Reference to the preview container where the poster is displayed
  const posterPreviewRef = useRef<HTMLDivElement>(null);
  // Scale factor used to shrink the full-size poster into the preview box
  const [posterScale, setPosterScale] = useState(1);

  useEffect(() => {
    if (!reportData) {
      navigate('/');
    }
  }, [reportData, navigate]);

  useEffect(() => {
    // Get available width inside preview container
    const previewContainer = posterPreviewRef.current;
    if (!previewContainer) return;

    const updateScale = () => {
      // Scale poster proportionally based on original width (1080px)
      // Never scale larger than 1 (100%)
      const availableWidth = previewContainer.clientWidth;
      setPosterScale(Math.min(1, availableWidth / 1080));
    };

    // Run once when component mounts
    updateScale();

    // Watch for container resizing
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(previewContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleUpdateForm = (newData: Partial<typeof reportData>) => {
    if (reportData) {
      setReportData({ ...reportData, ...newData });
    }
  };

  const handleProceedToPayment = () => {
    navigate('/plans');
  };

  if (!reportData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow pt-20 lg:pt-0 pb-8">
        <div className="w-full color-secondary-bg py-6 lg:py-8 px-4 border-b border-yellow-200">
          <Text variant="h1" weight="medium" as="h1" className="text-center">
            Confirmación de datos
          </Text>
        </div>
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto pt-12 lg:pt-10">
          <DataConfirmation
            formData={reportData}
            updateForm={handleUpdateForm}
          />

          <div
            ref={posterPreviewRef}
            className="w-full max-w-[512px] aspect-[4/5] mx-auto my-10 overflow-hidden color-grey-border"
          >
            <div className="relative w-full h-full">
              <div
                className="absolute top-0 left-1/2"
                style={{
                  width: '1080px',
                  height: '1350px',
                  // shrinks the full-size poster to fit in the preview container
                  // and centers it horizontally
                  transform: `translateX(-50%) scale(${posterScale})`,
                  transformOrigin: 'top center',
                }}
              >
                <Poster ref={posterRef} pet={reportData} />
              </div>
            </div>
          </div>

          <div className="max-w-lg mx-auto pb-8 mt-8 flex justify-center">
            <Button
              onClick={handleProceedToPayment}
              label="Proceder al pago"
              variant="primary"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
