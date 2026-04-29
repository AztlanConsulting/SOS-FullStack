import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DataConfirmation } from '../features/users/components/DataConfirmation';
import Header from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import { usePetReport } from '@/features/users/context/PetReportContext';

export const ReportConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportData, setReportData } = usePetReport();

  useEffect(() => {
    if (!reportData) {
      navigate('/');
    }
  }, [reportData, navigate]);

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
