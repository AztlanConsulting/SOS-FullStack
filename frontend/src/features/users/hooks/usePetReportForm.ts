import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PhoneNumberUtil } from 'google-libphonenumber';
import type { PetReportData } from '../types/petReport.types';
import { usePetReport } from '../context/PetReportContext';

const phoneUtil = PhoneNumberUtil.getInstance();

const normalizePhone = (phone: string) => phone.replace(/[^\d+]/g, '');

const isPhonePossible = (phone: string) => {
  try {
    const normalized = normalizePhone(phone);
    const parsed = phoneUtil.parseAndKeepRawInput(normalized);
    const regionCode = phoneUtil.getRegionCodeForNumber(parsed);

    if (!regionCode) return false;

    return phoneUtil.isValidNumber(parsed);
  } catch {
    return false;
  }
};

const isPhoneEmpty = (phone: string) => {
  try {
    const parsed = phoneUtil.parse(normalizePhone(phone));
    return phoneUtil.getNationalSignificantNumber(parsed).length === 0;
  } catch {
    return true;
  }
};

export const usePetReportForm = (initialData?: Partial<PetReportData>) => {
  const navigate = useNavigate();
  const { setReportData } = usePetReport();

  const [formData, setFormData] = useState<PetReportData>({
    name: '',
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

    planName: '',
    planDetails: {
      days: 3,
      km: 5,
      selectedFeatures: [],
      totalPrice: 0,
    },

    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (newData: Partial<PetReportData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));

    setErrors((prev) => {
      const copy = { ...prev };
      const updatedFields = Object.keys(newData);

      updatedFields.forEach((fieldName) => {
        if (copy[fieldName]) {
          delete copy[fieldName];
        }
      });

      if (
        updatedFields.includes('images') ||
        updatedFields.includes('imageLayout')
      ) {
        delete copy.images;
        Object.keys(copy).forEach((key) => {
          if (key.startsWith('images_')) {
            delete copy[key];
          }
        });
      }

      // Moving the pin updates coordinates first; treat that as valid location interaction.
      if (updatedFields.includes('locationCoords')) {
        delete copy.address;
      }

      return copy;
    });
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

    if (!formData.name) newErrors.name = 'Ingresa el nombre de tu mascota';

    if (!formData.species) newErrors.species = 'Selecciona una especie';

    if (!formData.date) {
      newErrors.date = 'Selecciona una fecha';
    } else {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      if (formData.date > todayStr) {
        newErrors.date = 'La fecha no puede ser futura';
      }
    }

    if (!formData.sex) newErrors.sex = 'Selecciona el sexo de la mascota';

    if (!formData.size) newErrors.size = 'Selecciona el tamaño de la mascota';

    if (!formData.breed) newErrors.breed = 'Ingresa una raza o tipo';

    if (!formData.color) newErrors.color = 'Ingresa un color';

    if (!formData.address && !formData.locationCoords) {
      newErrors.address = 'Ingresa una ubicación';
    }

    const expectedPhotoCount = parseInt(formData.imageLayout || '1');
    const selectedPhotos = (formData.images || []).slice(0, expectedPhotoCount);
    const uploadedPhotoCount = selectedPhotos.filter((file) => !!file).length;

    if (uploadedPhotoCount < expectedPhotoCount) {
      newErrors.images =
        'Debes subir todas las fotos de la distribución seleccionada';

      for (let i = 0; i < expectedPhotoCount; i++) {
        if (!selectedPhotos[i]) {
          newErrors[`images_${i + 1}`] = `Falta la foto ${i + 1}`;
        }
      }
    }

    if (!formData.contactName)
      newErrors.contactName = 'Ingresa el nombre del dueño';

    if (!formData.phoneNumber || isPhoneEmpty(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Ingresa un número de teléfono';
    } else if (!isPhonePossible(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Número de teléfono inválido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Ingresa un correo electrónico';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    (formData.images || []).forEach((file, index) => {
      if (file && file.size > MAX_SIZE) {
        newErrors[`images_${index + 1}`] = 'La imagen no debe superar los 5MB';
      }
    });

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
