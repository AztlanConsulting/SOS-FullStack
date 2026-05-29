import React from 'react';
import { Text } from '../Text';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hasLength?: boolean;
  maxDigits?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  required,
  maxLength = 50,
  value = '',
  error,
  hasLength = true,
  maxDigits,
  ...props
}) => {
  const { type = 'text' } =
    props as React.InputHTMLAttributes<HTMLInputElement>;
  const currentLength = String(value).length;
  const remaining = maxLength - currentLength;
  const hasErrorState = Boolean(error);

  const maxNumberValue =
    typeof maxDigits === 'number' ? Math.pow(10, maxDigits) - 1 : undefined;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (type === 'number' && typeof maxDigits === 'number') {
      // keep only digits and truncate to maxDigits
      const raw = String(e.target.value);
      const digitsOnly = raw.replace(/[^0-9]/g, '');
      const truncated =
        digitsOnly.length > maxDigits
          ? digitsOnly.slice(0, maxDigits)
          : digitsOnly;
      const newEvent = {
        ...e,
        target: { ...e.target, value: truncated },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      props.onChange?.(newEvent);
      return;
    }

    props.onChange?.(e);
  };

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
          {...props}
          id={id}
          required={required}
          maxLength={maxLength}
          value={value}
          className="w-full text-sm text-gray-700 bg-transparent outline-none"
          max={maxNumberValue}
          onChange={handleChange}
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
        {hasLength &&
          (type === 'number' ? (
            ''
          ) : (
            <Text
              variant="caption"
              as="span"
              weight="medium"
              className="whitespace-nowrap text-right text-emerald-700 shrink-0"
            >
              Quedan {remaining} caracteres
            </Text>
          ))}
      </div>
    </div>
  );
};
