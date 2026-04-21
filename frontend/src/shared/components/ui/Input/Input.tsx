import React from 'react';
import { Text } from '../Text';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  required,
  maxLength = 50,
  value = '',
  error,
  ...props
}) => {
  const currentLength = String(value).length;
  const remaining = maxLength - currentLength;

  return (
    <div className="flex flex-col w-full">
      <div className="relative border border-gray-400 rounded-lg px-2 py-1 bg-white focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 group">
        <label htmlFor={id} className="block text-xs text-gray-400">
          {label}{' '}
          {required && (
            <span className="block text-xs text-gray-400 group-focus-within:text-[var(--color-primary)]">
              *
            </span>
          )}
        </label>
        <input
          id={id}
          required={required}
          maxLength={maxLength}
          value={value}
          className="w-full text-sm text-gray-700 bg-transparent outline-none"
          {...props}
        />
      </div>

      <Text
        variant="caption"
        as="caption"
        weight="medium"
        className="text-right text-emerald-700"
      >
        Quedan {remaining} caracteres
      </Text>
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
