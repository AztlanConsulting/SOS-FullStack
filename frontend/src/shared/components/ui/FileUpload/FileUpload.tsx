import React, { useState } from 'react';
import { Text } from '../Text';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
];

interface FileUploadProps {
  index: number;
  onChange?: (file: File | null) => void;
  error?: string;
  currentFileName?: string;
  defaultDisplayName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  index,
  onChange,
  error,
  currentFileName,
  defaultDisplayName,
}) => {
  const [typeError, setTypeError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    e.currentTarget.value = '';

    if (file) {
      const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);
      const hasValidExt = /\.(jpg|jpeg|png|heic|heif)$/i.test(file.name);

      // Pass validation if either the Mime type OR the filename extension matches
      if (!hasValidMime && !hasValidExt) {
        setTypeError('Solo se permiten archivos JPG/JPEG, PNG o HEIC/HEIF');
        return;
      }
    }

    setTypeError(null);
    if (onChange) onChange(file);
  };

  const displayedError = typeError ?? error;
  const hasErrorState = Boolean(displayedError);

  return (
    <div>
      <label
        className={`relative w-full h-12 border rounded-lg bg-white flex items-center justify-center text-gray-700 text-sm font-medium transition-all cursor-pointer active:scale-[0.98] overflow-hidden px-4 ${hasErrorState ? 'border-red-500' : 'border-gray-400'}`}
      >
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/jpg,image/heic,image/heif"
          onClick={(e) => {
            e.currentTarget.value = '';
          }}
          onChange={handleChange}
        />

        <span className="truncate max-w-[70%]">
          {currentFileName || defaultDisplayName || `Subir foto ${index}`}
        </span>

        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 text-gray-500 absolute right-4"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </label>
      {displayedError && (
        <Text
          variant="small"
          as="small"
          weight="regular"
          className="color-danger ml-1 italic"
        >
          {displayedError}
        </Text>
      )}
    </div>
  );
};
