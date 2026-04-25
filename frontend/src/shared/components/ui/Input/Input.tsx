import React from 'react';
import { Text } from '../Text';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hasLength?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  required,
  maxLength = 50,
  value = '',
  error,
  hasLength = true,
  ...props
}) => {
  const currentLength = String(value).length;
  const remaining = maxLength - currentLength;
  const hasErrorState = Boolean(error);

  return (
    <div className="flex flex-col w-full">
      <div
        className={`relative border rounded-lg px-2 py-1 bg-white focus-within:ring-1 group ${
          hasErrorState
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
            : 'border-gray-400 focus-within:border-yellow-500 focus-within:ring-yellow-500'
        }`}
      >
        <label
          htmlFor={id}
          className={`block text-xs text-gray-400 ${hasErrorState ? 'group-focus-within:text-red-500' : 'group-focus-within:text-[var(--color-primary)]'}`}
        >
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
      <div
        className={`flex ${hasErrorState ? 'justify-between' : 'justify-end'}`}
      >
        {error && (
          <Text
            variant="small"
            as="small"
            weight="regular"
            className="color-danger ml-1 italic mt-1"
          >
            {error}
          </Text>
        )}
        {hasLength && (
          <Text
            variant="caption"
            as="caption"
            weight="medium"
            className="text-right text-emerald-700"
          >
            Quedan {remaining} caracteres
          </Text>
        )}
      </div>
    </div>
  );
};
