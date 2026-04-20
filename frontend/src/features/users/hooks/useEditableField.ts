import { useState, useEffect } from 'react';
import type { PetReportData } from '../types/petReport.types';

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

    if (!trimmed) {
      setError('Este campo no puede quedar vacío.');
      return;
    }

    updateForm({ [field]: trimmed });
    setError('');
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
