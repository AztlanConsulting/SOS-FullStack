import React, { useState } from 'react';
import { DataConfirmation } from '../features/users/components/DataConfirmation';
import { usePetReport } from '../features/users/context/PetReportContext';
import type { PetReportData } from '../features/users/types/petReport.types';

const DUMMY_REPORT_DATA: PetReportData = {
  name: 'Chiqui',
  species: 'Perro',
  date: '24/02/2026',
  breed: 'Husky',
  sex: 'Macho',
  color: 'Café y blanco',
  size: 'Grande',
  description: 'Ojo izquierdo blanco, derecho café. Patas rosas.',
  images: [],
  imageLayout: '3',
  address: 'Tec de Monterrey Campus Querétaro',
  location: null,
  locationCoords: [20.6133, -100.3953],
  contactName: 'Juan Pedro Rodríguez',
  phoneNumber: '+52 442 123 4567',
  email: 'juan123@gmail.com',
};

export const ReportConfirmationPage: React.FC<{
  onNavigateToPayment: () => void;
}> = ({ onNavigateToPayment }) => {
  const [formData, setFormData] = useState<PetReportData>(DUMMY_REPORT_DATA);
  const { setReportData } = usePetReport(); // Extraemos la función de nuestro Contexto

  const handleUpdateForm = (newData: Partial<PetReportData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleProceedToPayment = () => {
    setReportData(formData);
    onNavigateToPayment();
  };

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-8 px-4">
      <DataConfirmation formData={formData} updateForm={handleUpdateForm} />
      <div className="max-w-lg mx-auto pb-8">
        <button
          onClick={handleProceedToPayment}
          className="bg-[#FFD100] text-black font-bold py-4 rounded-full w-full shadow-md hover:bg-yellow-400 transition-colors mt-4"
        >
          Simular: Proceder al pago
        </button>
      </div>
    </div>
  );
};
