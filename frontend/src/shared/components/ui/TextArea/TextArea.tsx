import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  id,
  maxLength,
  value = '',
  ...props
}) => {
  const currentLength = String(value).length;
  const remaining = maxLength ? maxLength - currentLength : null;

  return (
    <div className="flex flex-col w-full">
      <div className="relative border border-gray-400 rounded-lg px-2 py-1 bg-white focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
        <label htmlFor={id} className="block text-xs text-gray-400">
          {label}
        </label>
        <textarea
          id={id}
          maxLength={maxLength}
          value={value}
          className="w-full text-sm text-gray-700 bg-transparent outline-none resize-none min-h-[100px]"
          {...props}
        />
      </div>
      {/* Contador dinámico de caracteres */}
      {maxLength && (
        <div className="text-right text-sm text-emerald-700 mt-2 font-medium">
          Quedan {remaining} caracteres
        </div>
      )}
    </div>
  );
};
