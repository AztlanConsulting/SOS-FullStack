import { useState } from 'react';
import type { SearchFormData } from '../types/searchForm.types';
import { initialSearchFormData } from '../types/searchForm.types';
import { createSearchForm } from '../services/searchForm.service';

export const useSearchForm = (initialData?: Partial<SearchFormData>) => {
  const [formData, setFormData] = useState<SearchFormData>({
    ...initialSearchFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateFormData = (newData: Partial<SearchFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));

    setErrors((prev) => {
      const copy = { ...prev };
      const updatedFields = Object.keys(newData);

      updatedFields.forEach((fieldName) => {
        if (copy[fieldName]) {
          delete copy[fieldName];
        }
      });

      return copy;
    });
  };

  const scrollToFirstError = (formErrors: Record<string, string>) => {
    const fieldMap: Record<string, string> = {
      species: 'species-section',
      size: 'size-section',
      approximateAge: 'approximate-age-section',
      sex: 'sex-section',
      sterilized: 'sterilized-section',
      collarTag: 'collar-tag-section',
      physicalCondition: 'physical-condition',
      visualReferences: 'visual-references',
      zoneType: 'zone-type',
      additionalCircumstances: 'additional-circumstances',
      personality: 'personality',
      canBeCaught: 'can-be-caught',
      noiseReaction: 'noise-reaction',
      respondsToName: 'responds-to-name',
      usedToGoingOut: 'used-to-going-out',
      hasEscapedBefore: 'has-escaped-before',
      whatHappenedWhenEscaped: 'what-happened-when-escaped',
      fears: 'fears',
      easilySocializes: 'easily-socializes',
      helpCount: 'help-count',
      nearbyFeatures: 'nearby-features',
      streetAnimals: 'street-animals',
      trafficLevel: 'traffic-level',
      zoneFamiliarity: 'zone-familiarity',
      attachedTo: 'attached-to',
      toyBlanket: 'toy-blanket',
      favoriteFood: 'favorite-food',
      whatBringsBack: 'what-brings-back',
      favoritePlace: 'favorite-place',
      vaccinationCard: 'vaccination-card-upload',
    };

    const firstErrorField = Object.keys(formErrors)[0];
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.species) newErrors.species = 'Selecciona una especie';
    if (!formData.size) newErrors.size = 'Selecciona un tamaño';
    if (formData.approximateAge === '')
      newErrors.approximateAge = 'Ingresa una edad aproximada';
    if (!formData.sex) newErrors.sex = 'Selecciona el sexo';
    if (!formData.zoneType) newErrors.zoneType = 'Selecciona un tipo de zona';
    if (!formData.canBeCaught) newErrors.canBeCaught = 'Selecciona una opción';
    if (!formData.noiseReaction)
      newErrors.noiseReaction = 'Selecciona una reacción';
    if (!formData.respondsToName)
      newErrors.respondsToName = 'Selecciona una opción';
    if (!formData.easilySocializes)
      newErrors.easilySocializes = 'Selecciona una opción';
    if (!formData.helpCount) newErrors.helpCount = 'Selecciona una opción';
    if (!formData.streetAnimals)
      newErrors.streetAnimals = 'Selecciona una opción';
    if (!formData.trafficLevel) newErrors.trafficLevel = 'Selecciona un nivel';
    if (!formData.zoneFamiliarity)
      newErrors.zoneFamiliarity = 'Selecciona una opción';

    if (formData.noiseReaction === 'Other' && !formData.noiseReactionOther) {
      newErrors.noiseReactionOther = 'Describe la reacción';
    }

    if (
      formData.hasEscapedBefore === 'Yes' &&
      !formData.whatHappenedWhenEscaped
    ) {
      newErrors.whatHappenedWhenEscaped = 'Describe qué pasó';
    }

    const MAX_SIZE = 15 * 1024 * 1024;

    if (formData.vaccinationCard && formData.vaccinationCard instanceof File) {
      if (formData.vaccinationCard.size > MAX_SIZE) {
        newErrors.vaccinationCard = 'El archivo no debe superar los 15MB';
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];

      if (
        formData.vaccinationCard instanceof File &&
        !allowedTypes.includes(formData.vaccinationCard.type)
      ) {
        newErrors.vaccinationCard = 'Solo se aceptan PDF o imágenes';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const payload = { ...formData };

        if (formData.vaccinationCard instanceof File) {
          payload.vaccinationCard = await fileToBase64(
            formData.vaccinationCard,
          );
        } else {
          payload.vaccinationCard = '';
        }

        if (!payload.noiseReactionOther) {
          payload.noiseReactionOther = '';
        }
        if (!payload.whatHappenedWhenEscaped) {
          payload.whatHappenedWhenEscaped = '';
        }

        if (typeof payload.approximateAge === 'string') {
          payload.approximateAge = Number(payload.approximateAge);
        }

        await createSearchForm(payload);
        setSubmitSuccess(true);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Error al enviar el formulario',
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      scrollToFirstError(newErrors);
    }
  };

  const resetForm = () => {
    setFormData({ ...initialSearchFormData });
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError(null);
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    updateFormData,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
    resetForm,
  };
};
