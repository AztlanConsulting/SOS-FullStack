import { useState, useEffect } from 'react';
import type { PetReportData } from '../types/petReport.types';

export const useEditableField = (
  value: string,
  field: keyof PetReportData,
  updateForm: (newData: Partial<PetReportData>) => void,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    updateForm({ [field]: tempValue });
    setIsEditing(false);
  };

  return { isEditing, setIsEditing, tempValue, setTempValue, handleSave };
};
