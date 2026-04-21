import { useState, useEffect } from 'react';
import type { PetReportData } from '../types/petReport.types';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const useEditableField = (
  value: string,
  field: keyof PetReportData,
  updateForm: (newData: Partial<PetReportData>) => void,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState('');

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    const trimmed = tempValue.trim();
    setError('');

    if (!trimmed) {
      setError('Este campo no puede quedar vacío.');
      return;
    }

    if (field === 'phoneNumber') {
      try {
        const parsedNumber = phoneUtil.parseAndKeepRawInput(trimmed);
        if (!phoneUtil.isValidNumber(parsedNumber)) {
          setError('El número no es válido para el país seleccionado.');
          return;
        }
      } catch (e) {
        setError('Añade un número de teléfono válido.');
        return;
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setError('El formato del correo es inválido.');
        return;
      }
    }

    if (field === 'date') {
      const selectedDate = new Date(trimmed);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        setError('La fecha no puede ser futura.');
        return;
      }
    }

    updateForm({ [field]: trimmed });
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    tempValue,
    setTempValue,
    handleSave,
    error,
  };
};
