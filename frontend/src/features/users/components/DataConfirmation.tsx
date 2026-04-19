import React, { useState, useEffect } from 'react';
import type { PetReportData } from '../types/petReport.types';

import { Input } from '@shared/components/ui/Input/Input';
import { Select } from '@shared/components/ui/Select/Select';
import { TextArea } from '@shared/components/ui/TextArea/TextArea';
import { DateInput } from '@shared/components/ui/DateInput/DateInput';
import { PhoneInput } from '@shared/components/ui/PhoneInput/PhoneInput';

import { PetLocationSection } from './PetLocationSection';
import { PetPhotosSection } from './PetPhotosSection';

export interface DataConfirmationProps {
  formData: PetReportData;
  updateForm: (newData: Partial<PetReportData>) => void;
}

const EditableField = ({
  label,
  value,
  field,
  type = 'text',
  options = [],
  maxLength,
  updateForm,
}: {
  label: string;
  value: string;
  field: keyof PetReportData;
  type?: 'text' | 'select' | 'date' | 'textarea' | 'phone';
  options?: { value: string; label: string }[];
  maxLength?: number;
  updateForm: (newData: Partial<PetReportData>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    updateForm({ [field]: tempValue });
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-lg flex flex-col justify-center mb-3 min-h-[70px] transition-all ${isEditing ? 'bg-transparent' : 'bg-gray-100 p-4'}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2 w-full">
          {type === 'text' && (
            <Input
              id={field}
              label={label}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
          )}
          {type === 'select' && (
            <Select
              id={field}
              label={label}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              options={options}
            />
          )}
          {type === 'date' && (
            <DateInput
              id={field}
              label={label}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
          )}
          {type === 'textarea' && (
            <TextArea
              id={field}
              label={label}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              maxLength={maxLength}
            />
          )}
          {type === 'phone' && (
            <PhoneInput
              label={label}
              value={tempValue}
              onChange={(val) => setTempValue(val)}
            />
          )}

          <div className="flex justify-end mt-1">
            <button
              onClick={handleSave}
              className="bg-[#FFD100] text-black px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-yellow-400 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">{label}</span>
            <span className="text-sm text-gray-800 mt-1">{value || '-'}</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const EditableLocation = ({
  formData,
  updateForm,
}: {
  formData: PetReportData;
  updateForm: (newData: Partial<PetReportData>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`rounded-lg flex flex-col justify-center mb-3 min-h-[70px] transition-all ${isEditing ? 'bg-transparent' : 'bg-gray-100 p-4'}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-4 w-full bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
          <PetLocationSection
            formData={formData}
            updateForm={updateForm}
            reportType="lost"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-[#FFD100] text-black px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-yellow-400 transition-colors"
            >
              Confirmar Ubicación
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">
              Lugar de extravío
            </span>
            <span className="text-sm text-gray-800 mt-1">
              {formData.address || '-'}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const EditablePhotos = ({
  formData,
  updateForm,
}: {
  formData: PetReportData;
  updateForm: (newData: Partial<PetReportData>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.images && formData.images.length > 0) {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));

      const validImages = formData.images.filter((f) => !!f);
      const urls = validImages.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);

      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setImageUrls([]);
    }
  }, [formData.images]);

  const handleConfirm = () => {
    if (!formData.images || formData.images.filter((f) => !!f).length === 0) {
      setError('Debes subir al menos una foto de tu mascota.');
      return;
    }
    setError(null);
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-lg flex flex-col justify-center mb-3 min-h-[70px] transition-all ${isEditing ? 'bg-transparent' : 'bg-gray-100 p-4'}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-4 w-full bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
          <PetPhotosSection formData={formData} updateForm={updateForm} />

          {error && (
            <p className="text-red-500 text-xs text-center font-bold">
              {error}
            </p>
          )}

          <div className="flex justify-end mt-2">
            <button
              onClick={handleConfirm}
              className="bg-[#FFD100] text-black px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-yellow-400 transition-colors"
            >
              Confirmar Fotos
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-400 font-medium">Fotos</span>
            <button
              onClick={() => {
                setIsEditing(true);
                setError(null);
              }}
              className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </div>

          {imageUrls.length > 0 ? (
            <div className="flex flex-col gap-2 w-full px-1">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Mascota ${index + 1}`}
                    className="w-full h-auto object-contain block"
                  />
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No se subieron fotos.</span>
          )}
        </div>
      )}
    </div>
  );
};

export const DataConfirmation: React.FC<DataConfirmationProps> = ({
  formData,
  updateForm,
}) => {
  const speciesOptions = [
    { value: 'Perro', label: 'Perro' },
    { value: 'Gato', label: 'Gato' },
    { value: 'Ave', label: 'Ave' },
    { value: 'Otro', label: 'Otro' },
  ];

  const sexOptions = [
    { value: 'Macho', label: 'Macho' },
    { value: 'Hembra', label: 'Hembra' },
    { value: 'Desconocido', label: 'Desconocido' },
  ];

  const sizeOptions = [
    { value: 'Mini: 1 a 4 kg', label: 'Mini: 1 a 4 kg' },
    { value: 'Pequeña: 5 a 10 kg', label: 'Pequeña: 5 a 10 kg' },
    { value: 'Mediana: 11 a 25 kg', label: 'Mediana: 11 a 25 kg' },
    { value: 'Grande: 26 a 45 kg', label: 'Grande: 26 a 45 kg' },
    { value: 'Gigante: más de 45 kg', label: 'Gigante: más de 45 kg' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <section>
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            Información de la mascota
          </h3>
          <EditableField
            updateForm={updateForm}
            type="text"
            label="Nombre de la mascota"
            value={formData.name || ''}
            field="name"
          />
          <EditableField
            updateForm={updateForm}
            type="select"
            label="Especie de la mascota"
            value={formData.species || ''}
            field="species"
            options={speciesOptions}
          />
          <EditableField
            updateForm={updateForm}
            type="date"
            label="Fecha de extravío"
            value={formData.date || ''}
            field="date"
          />
          <EditableField
            updateForm={updateForm}
            type="text"
            label="Raza/tipo de la mascota"
            value={formData.breed || ''}
            field="breed"
          />
          <EditableField
            updateForm={updateForm}
            type="select"
            label="Sexo de la mascota"
            value={formData.sex || ''}
            field="sex"
            options={sexOptions}
          />
          <EditableField
            updateForm={updateForm}
            type="text"
            label="Color de la mascota"
            value={formData.color || ''}
            field="color"
          />
          <EditableField
            updateForm={updateForm}
            type="select"
            label="Talla de la mascota"
            value={formData.size || ''}
            field="size"
            options={sizeOptions}
          />
          <EditableField
            updateForm={updateForm}
            type="textarea"
            label="Descripción adicional de la mascota"
            value={formData.description || ''}
            field="description"
            maxLength={200}
          />
        </section>

        <h3 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Fotos de la mascota
        </h3>
        <section>
          <EditablePhotos formData={formData} updateForm={updateForm} />
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            Donde se perdió
          </h3>
          <EditableLocation formData={formData} updateForm={updateForm} />
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            Información de contacto
          </h3>
          <EditableField
            updateForm={updateForm}
            type="text"
            label="Nombre y apellido"
            value={formData.contactName || ''}
            field="contactName"
          />
          <EditableField
            updateForm={updateForm}
            type="phone"
            label="Número de teléfono"
            value={formData.phoneNumber || ''}
            field="phoneNumber"
          />
          <EditableField
            updateForm={updateForm}
            type="text"
            label="Correo electrónico"
            value={formData.email || ''}
            field="email"
          />
        </section>
      </div>
    </div>
  );
};
