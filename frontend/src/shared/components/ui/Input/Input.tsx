import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  required,
  ...props
}) => {
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
          className="w-full text-sm text-gray-700 bg-transparent outline-none"
          {...props}
        />
      </div>
    </div>
  );
};
