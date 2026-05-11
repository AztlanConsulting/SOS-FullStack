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
      especie: 'especie-section',
      tamano: 'tamano-section',
      edadAproximada: 'edad-section',
      sexo: 'sexo-section',
      esterilizado: 'esterilizado-section',
      collarPlaca: 'collar-section',
      condicionFisica: 'condicion-fisica',
      referenciasVisuales: 'referencias-visuales',
      tipoZona: 'tipo-zona',
      circunstanciasAdicionales: 'circunstancias',
      personalidad: 'personalidad',
      seDejaAgarrar: 'deja-agarrar',
      reaccionRuidos: 'reaccion-ruidos',
      respondeNombre: 'responde-nombre',
      acostumbradoSalir: 'acostumbrado-salir',
      haEscapadoAntes: 'ha-escapado',
      quePasoEscapado: 'que-paso-escapado',
      tieneMiedo: 'tiene-miedo',
      leFacilSocializar: 'facil-socializar',
      cuentaAyuda: 'cuenta-ayuda',
      queHayCerca: 'que-hay-cerca',
      animalesCallejeros: 'animales-callejeros',
      nivelTrafico: 'nivel-trafico',
      familiaridadZona: 'familiaridad-zona',
      apedidoA: 'apegado-a',
      jugueteManta: 'juguete-manta',
      comidaFavorita: 'comida-favorita',
      queHaceVolver: 'que-hace-volver',
      lugarFavorito: 'lugar-favorito',
      cartillaVacunacion: 'cartilla-upload',
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

    if (!formData.especie) newErrors.especie = 'Selecciona una especie';
    if (!formData.tamano) newErrors.tamano = 'Selecciona un tamaño';
    if (formData.edadAproximada === '')
      newErrors.edadAproximada = 'Ingresa una edad aproximada';
    if (!formData.sexo) newErrors.sexo = 'Selecciona el sexo';
    if (!formData.tipoZona) newErrors.tipoZona = 'Selecciona un tipo de zona';
    if (!formData.seDejaAgarrar)
      newErrors.seDejaAgarrar = 'Selecciona una opción';
    if (!formData.reaccionRuidos)
      newErrors.reaccionRuidos = 'Selecciona una reacción';
    if (!formData.respondeNombre)
      newErrors.respondeNombre = 'Selecciona una opción';
    if (!formData.leFacilSocializar)
      newErrors.leFacilSocializar = 'Selecciona una opción';
    if (!formData.cuentaAyuda) newErrors.cuentaAyuda = 'Selecciona una opción';
    if (!formData.animalesCallejeros)
      newErrors.animalesCallejeros = 'Selecciona una opción';
    if (!formData.nivelTrafico) newErrors.nivelTrafico = 'Selecciona un nivel';
    if (!formData.familiaridadZona)
      newErrors.familiaridadZona = 'Selecciona una opción';

    if (formData.reaccionRuidos === 'Otro' && !formData.reaccionRuidosOtro) {
      newErrors.reaccionRuidosOtro = 'Describe la reacción';
    }

    if (formData.haEscapadoAntes === 'Si' && !formData.quePasoEscapado) {
      newErrors.quePasoEscapado = 'Describe qué pasó';
    }

    const MAX_SIZE = 15 * 1024 * 1024;

    if (
      formData.cartillaVacunacion &&
      formData.cartillaVacunacion instanceof File
    ) {
      if (formData.cartillaVacunacion.size > MAX_SIZE) {
        newErrors.cartillaVacunacion = 'El archivo no debe superar los 15MB';
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];

      if (
        formData.cartillaVacunacion instanceof File &&
        !allowedTypes.includes(formData.cartillaVacunacion.type)
      ) {
        newErrors.cartillaVacunacion = 'Solo se aceptan PDF o imágenes';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const payload = { ...formData };

        // Convert cartillaVacunacion to base64 if it's a File
        if (formData.cartillaVacunacion instanceof File) {
          payload.cartillaVacunacion = await fileToBase64(
            formData.cartillaVacunacion,
          );
        } else {
          payload.cartillaVacunacion = ''; // Send empty string if no file
        }

        // Ensure required string fields are always sent
        if (!payload.reaccionRuidosOtro) {
          payload.reaccionRuidosOtro = '';
        }
        if (!payload.quePasoEscapado) {
          payload.quePasoEscapado = '';
        }

        // Convert edadAproximada to number
        if (typeof payload.edadAproximada === 'string') {
          payload.edadAproximada = Number(payload.edadAproximada);
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
