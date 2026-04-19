import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import type { PetReportData } from '../types/petReport.types';
import { UserInfoSection } from './UserInfoSection';
import { PetPhotosSection } from './PetPhotosSection';
import { PetLocationSection } from './PetLocationSection';
import { ContactInfoSection } from './ContactInfoSection';
import { usePetReport } from '../context/PetReportContext';

export interface PetReportFormProps {
  initialData?: Partial<PetReportData>;
}

export const PetReportForm: React.FC<PetReportFormProps> = ({
  initialData,
}) => {
  const navigate = useNavigate();
  const { setReportData } = usePetReport();

  const [formData, setFormData] = useState<PetReportData>({
    name: '',
    species: '',
    date: '',
    breed: '',
    sex: 'Desconocido',
    color: '',
    size: 'Mediana',
    description: '',
    images: [],
    imageLayout: '3',
    address: '',
    location: null,
    locationCoords: undefined,
    contactName: '',
    phoneNumber: '',
    email: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (newData: Partial<PetReportData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    const fieldName = Object.keys(newData)[0];
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = '¡Nos falta el nombre de tu mascota!';
    if (!formData.species)
      newErrors.species = '¡Por favor, selecciona una especie!';
    if (!formData.date) newErrors.date = '¡Indícanos la fecha del suceso!';
    if (!formData.breed) newErrors.breed = '¡Nos falta conocer su raza o tipo!';
    if (!formData.color)
      newErrors.color = '¡Dinos de qué color es para identificarla mejor!';

    if (!formData.address)
      newErrors.address = '¡Necesitamos saber dónde ocurrió!';
    if (!formData.images || formData.images.length === 0)
      newErrors.images = '¡Sube al menos una foto para el cartel!';

    if (!formData.contactName)
      newErrors.contactName = '¡Falta tu nombre y apellido!';
    if (!formData.phoneNumber)
      newErrors.phoneNumber = '¡Añade un teléfono para que te contacten!';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = '¡Necesitamos tu correo electrónico!';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email =
        '¡El correo electrónico no parece tener un formato válido!';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setReportData(formData);
      navigate('/report-confirmation');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
