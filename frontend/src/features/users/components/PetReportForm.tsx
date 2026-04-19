import React from 'react';
import type { PetReportData } from '../types/petReport.types';
import { UserInfoSection } from './UserInfoSection';
import { PetPhotosSection } from './PetPhotosSection';
import { PetLocationSection } from './PetLocationSection';
import { ContactInfoSection } from './ContactInfoSection';
import { usePetReportForm } from '../hooks/usePetReportForm';

export interface PetReportFormProps {
  initialData?: Partial<PetReportData>;
}

export const PetReportForm: React.FC<PetReportFormProps> = ({
  initialData,
}) => {
  const { formData, errors, updateFormData, handleNext } =
    usePetReportForm(initialData);

  return (
    <div className="min-h-screen pb-24 pt-8 bg-white">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-8">
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
            <p className="font-bold mb-2">
              ¡Faltan algunos detalles importantes!
            </p>
            <ul className="list-disc ml-5 text-sm flex flex-col gap-1">
              {Object.values(errors).map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Información de la mascota
        </h2>
        <UserInfoSection formData={formData} updateForm={updateFormData} />

        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Fotos de la mascota
        </h2>
        <PetPhotosSection formData={formData} updateForm={updateFormData} />

        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Dónde se perdió
        </h2>
        <PetLocationSection formData={formData} updateForm={updateFormData} />

        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Información de contacto
        </h2>
        <ContactInfoSection formData={formData} updateForm={updateFormData} />

        <div className="mt-4">
          <button
            onClick={handleNext}
            className="bg-[#FFD100] text-black font-bold py-4 rounded-full w-full shadow-md hover:bg-yellow-400 transition-colors"
          >
            Confirmar Datos
          </button>
        </div>
      </div>
    </div>
  );
};
