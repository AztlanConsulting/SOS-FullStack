import React, { useState } from 'react';

interface FileUploadProps {
  index: number;
  onChange?: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ index, onChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    if (onChange) onChange(file);
  };

  return (
    <label className="relative w-full h-12 border border-gray-300 shadow-sm rounded-lg bg-white flex items-center justify-center text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer active:scale-[0.98] overflow-hidden px-4">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      <span className="truncate max-w-[70%]">
        {fileName ? fileName : `Subir foto ${index}`}
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
  );
};
