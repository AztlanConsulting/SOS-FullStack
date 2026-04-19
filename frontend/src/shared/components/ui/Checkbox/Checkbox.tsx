import React from 'react';
import { HiCheck } from 'react-icons/hi';

interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  disabled = false,
  onChange,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`flex items-center justify-center w-4 h-4 rounded border-2 transition-colors ${
        checked
          ? 'bg-[#F9CD48] border-[#F9CD48]'
          : 'bg-white border-gray-300 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {checked && <HiCheck size={14} className="text-white font-bold" />}
    </button>
  );
};

export default Checkbox;
