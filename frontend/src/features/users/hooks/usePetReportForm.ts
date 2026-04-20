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
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  const scrollToFirstError = (errors: Record<string, string>) => {
    const fieldMap: Record<string, string> = {
      name: 'petName',
      species: 'petSpecies',
      date: 'petDate',
      breed: 'petBreed',
      color: 'petColor',
      images: 'photo-upload-section',
      address: 'pet-location-input',
      contactName: 'ownerName',
      phoneNumber: 'ownerPhone',
      email: 'ownerEmail',
    };

    const firstErrorField = Object.keys(errors)[0];
    const elementId = fieldMap[firstErrorField];

    if (!elementId) return;

    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      setTimeout(() => {
        if ('focus' in element) {
          (element as HTMLElement).focus();
        }
      }, 400);
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = '¡Nos falta el nombre de tu mascota!';

    if (!formData.species) newErrors.species = '¡Selecciona una especie!';

    if (!formData.date) {
      newErrors.date = '¡Indícanos la fecha!';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.date = '¡La fecha no puede ser futura!';
      }
    }

    if (!formData.breed) newErrors.breed = '¡Falta raza o tipo!';

    if (!formData.color) newErrors.color = '¡Falta color!';

    if (!formData.address) newErrors.address = '¡Indica ubicación!';

    if (!formData.images || formData.images.length === 0)
      newErrors.images = '¡Sube al menos una foto!';

    if (!formData.contactName)
      newErrors.contactName = '¡Falta nombre del dueño!';

    const cleanPhone = (formData.phoneNumber || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phoneNumber = '¡Añade un número de teléfono!';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = '¡Falta correo!';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '¡Correo inválido!';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setReportData(formData);
      navigate('/report-confirmation');
    } else {
      scrollToFirstError(newErrors);
    }
  };

  return {
    formData,
    errors,
    updateFormData,
    handleNext,
  };
};
