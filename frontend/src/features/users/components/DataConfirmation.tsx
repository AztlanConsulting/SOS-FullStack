import React, { useState, useEffect } from 'react';
import type { PetReportData } from '../types/petReport.types';

export interface DataConfirmationProps {
  formData: PetReportData;
  updateForm: (newData: Partial<PetReportData>) => void;
}

export const DataConfirmation: React.FC<DataConfirmationProps> = ({
  formData,
  updateForm,
}) => {
  const EditableRow = ({
    label,
    value,
    field,
  }: {
    label: string;
    value: string;
    field: keyof PetReportData;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
      updateForm({ [field]: tempValue });
      setIsEditing(false);
    };

    return (
      <div className="bg-gray-100 rounded-lg p-4 flex flex-col justify-center mb-3 min-h-[70px]">
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <span className="text-xs text-gray-400 font-medium">{label}</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-yellow-400"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="bg-yellow-400 text-black px-3 py-1 rounded text-xs font-bold"
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
              className="text-gray-600 hover:text-black p-1"
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

  const ImagePreviewSection = () => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
      if (formData.images && formData.images.length > 0) {
        const urls = formData.images.map((file) => URL.createObjectURL(file));
        setImageUrls(urls);

        return () => urls.forEach((url) => URL.revokeObjectURL(url));
      } else {
        setImageUrls([]);
      }
    }, [formData.images]);

    return (
      <div className="bg-gray-100 rounded-lg p-4 flex flex-col mb-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-400 font-medium">Fotos</span>
          <button className="text-gray-600 hover:text-black p-1">
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
          <div className="flex flex-col gap-2">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Mascota ${index + 1}`}
                className="w-full h-auto object-cover rounded-md"
              />
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-500">No se subieron fotos.</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full bg-[#FFF5D1] py-4 text-center mb-8 rounded-lg">
        <h2 className="text-lg font-bold text-black">Confirmación de datos</h2>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-8">
        <section>
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            Información de la mascota
          </h3>
          <EditableRow
            label="Nombre de la mascota"
            value={formData.name || ''}
            field="name"
          />
          <EditableRow
            label="Especie de la mascota"
            value={formData.species || ''}
            field="species"
          />
          <EditableRow
            label="Fecha de extravío"
            value={formData.date || ''}
            field="date"
          />
          <EditableRow
            label="Raza/tipo de la mascota"
            value={formData.breed || ''}
            field="breed"
          />
          <EditableRow
            label="Sexo de la mascota"
            value={formData.sex || ''}
            field="sex"
          />
          <EditableRow
            label="Color de la mascota"
            value={formData.color || ''}
            field="color"
          />
          <EditableRow
            label="Talla de la mascota"
            value={formData.size || ''}
            field="size"
          />
          <EditableRow
            label="Descripción adicional de la mascota"
            value={formData.description || ''}
            field="description"
          />
        </section>

        <section>
          <ImagePreviewSection />
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            Donde se perdió
          </h3>
          <EditableRow
            label="Lugar de extravío"
            value={formData.address || ''}
            field="address"
          />
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            Información del dueño
          </h3>
          <EditableRow
            label="Nombre y apellido"
            value={formData.contactName || ''}
            field="contactName"
          />
          <EditableRow
            label="Número de teléfono"
            value={formData.phoneNumber || ''}
            field="phoneNumber"
          />
          <EditableRow
            label="Correo electrónico"
            value={formData.email || ''}
            field="email"
          />
        </section>

        <div className="pt-4">
          <button
            className="bg-[#FFD100] text-black font-bold py-4 rounded-full w-full shadow-md hover:bg-yellow-400 transition-colors"
            // onClick={handleProced}
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
};
