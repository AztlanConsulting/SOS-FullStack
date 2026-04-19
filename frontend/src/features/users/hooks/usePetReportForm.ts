import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { PetReportData } from '../types/petReport.types';
import { usePetReport } from '../context/PetReportContext';

export const usePetReportForm = (initialData?: Partial<PetReportData>) => {
  const navigate = useNavigate();
  const { setReportData } = usePetReport();

  const [formData, setFormData] = useState<PetReportData>({
    name: '',
    species: '',
    date: '',
    breed: '',
    sex: 'Desconocido',
    color: '',
    size: 'Mediana: 11 a 25 kg',
    description: '',
    images: [],
    imageLayout: '1',
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
    if (!formData.date) {
      newErrors.date = '¡Indícanos la fecha del suceso!';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.date = '¡La fecha no puede ser en el futuro!';
      }
    }
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

  return { formData, errors, updateFormData, handleNext };
};
