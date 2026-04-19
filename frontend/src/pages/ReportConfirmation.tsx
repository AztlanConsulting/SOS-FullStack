import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DataConfirmation } from '../features/users/components/DataConfirmation';
import { usePetReport } from '../features/users/context/PetReportContext';

import Header from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';

export const ReportConfirmationPage: React.FC<{
  onNavigateToPayment: () => void;
}> = ({ onNavigateToPayment }) => {
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
    onNavigateToPayment();
  };

  if (!reportData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow py-8 px-4">
        <div className="bg-[#FFF3C7] py-4 mb-8 -mx-4">
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Confirmación de datos
          </h1>
        </div>

        <DataConfirmation formData={reportData} updateForm={handleUpdateForm} />

        <div className="max-w-lg mx-auto pb-8 mt-8">
          <button
            onClick={handleProceedToPayment}
            className="bg-[#FFD100] text-black font-bold py-4 rounded-full w-full shadow-md hover:bg-yellow-400 transition-colors"
          >
            Proceder al pago
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
