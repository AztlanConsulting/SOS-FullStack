import React from 'react';
import { Text } from '../Text';

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  id,
  required,
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative border border-gray-400 rounded-lg px-2 py-1 bg-white focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
        <label htmlFor={id} className="block text-xs text-gray-400">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>

        <input
          type="date"
          id={id}
          className="w-full text-sm text-gray-700 bg-transparent outline-none relative z-10
                     [&::-webkit-calendar-picker-indicator]:opacity-0 
                     [&::-webkit-calendar-picker-indicator]:absolute 
                     [&::-webkit-calendar-picker-indicator]:right-0 
                     [&::-webkit-calendar-picker-indicator]:w-full 
                     [&::-webkit-calendar-picker-indicator]:h-full 
                     [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          {...props}
        />

        <div className="absolute right-3 top-1/2 translate-y-[-10%] pointer-events-none text-black z-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
        </div>
      </div>
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
