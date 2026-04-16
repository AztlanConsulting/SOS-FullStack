import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  options,
  required,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative border border-gray-400 rounded-lg p-2 bg-white focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
        <label htmlFor={id} className="block text-xs text-gray-400 mb-1">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        <select
          id={id}
          className="w-full text-sm text-gray-700 bg-transparent outline-none appearance-none cursor-pointer"
          {...props}
        >
          <option value="" disabled>
            Seleccionar una opción
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Ícono de flecha (Chevron) */}
        <div className="absolute right-3 top-1/2 translate-y-[-10%] pointer-events-none text-black">
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
