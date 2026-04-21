import React from 'react';
import { Text } from '../Text';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  maxLength?: number;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  id,
  maxLength,
  value = '',
  error,
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
      {maxLength && (
        <Text
          variant="caption"
          as="caption"
          weight="medium"
          className="text-right text-emerald-700"
        >
          Quedan {remaining} caracteres
        </Text>
      )}
      {error && (
        <Text
          variant="small"
          as="small"
          weight="bold"
          className="color-danger ml-1 italic"
        >
          {error}
        </Text>
      )}
    </div>
  );
};
