import { useState } from 'react';
import { reportFoundPet } from '../services/foundPetApi';
import type { FoundPetReportData } from '@/shared/types/petReport.types';
import { usePetReport } from '@/shared/context/PetReportContext';

export const usePetReportForm = (initialData?: Partial<FoundPetReportData>) => {
  const { setFoundPetReportData } = usePetReport();

  const [formData, setFormData] = useState<FoundPetReportData>({
    species: '',
    date: '',
    breed: '',
    sex: '',
    color: '',
    size: '',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateFormData = (newData: Partial<FoundPetReportData>) => {
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

  const handleClean = () => {
    setSuccess(false);
    setFormData({
      species: '',
      date: '',
      breed: '',
      sex: '',
      color: '',
      size: '',
      description: '',
      images: [],
      imageLayout: '1',
      address: '',
      location: null,
      locationCoords: undefined,
      contactName: '',
      phoneNumber: '',
      email: '',
    });
  };

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.species) newErrors.species = 'Selecciona una especie';

    if (!formData.sex) newErrors.sex = 'Selecciona el sexo de la mascota';

    if (!formData.size) newErrors.size = 'Selecciona el tamaño de la mascota';

    if (!formData.date) {
      newErrors.date = 'Selecciona una fecha';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.date = 'La fecha no puede ser futura.';
      }
    }

    if (!formData.breed) newErrors.breed = 'Ingresa una raza o tipo';

    if (!formData.color) newErrors.color = 'Ingresa un color';

    if (!formData.address) newErrors.address = 'Ingresa una ubicación';

    if (!formData.images || formData.images.length === 0)
      newErrors.images = 'Falta la foto ';

    if (!formData.contactName)
      newErrors.contactName = 'Ingresa un nombre para contactarte';

    const cleanPhone = (formData.phoneNumber || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phoneNumber = 'Ingresa un número de teléfono';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Ingresa un correo electrónico';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await reportFoundPet(formData);
        setFoundPetReportData(formData);
        setSuccess(true);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'Error al reportar la mascota',
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      scrollToFirstError(newErrors);
    }
  };

  return {
    formData,
    errors,
    updateFormData,
    handleNext,
    isSubmitting,
    submitError,
    success,
    setSuccess,
    handleClean,
  };
};
