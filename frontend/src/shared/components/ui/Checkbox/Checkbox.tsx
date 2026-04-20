import React from 'react';
import { HiCheck } from 'react-icons/hi';
/**
 * Props for the custom Checkbox component.
 */
interface CheckboxProps {
  /** Current state of the checkbox. */
  checked: boolean;
  /** If true, prevents interaction and applies a disabled style. */
  disabled?: boolean;
  /** Callback function executed when the checkbox is clicked. */
  onChange: (checked: boolean) => void;
  className?: string;
}

/**
 * A custom-styled Checkbox component built using a button element.
 * It provides better cross-browser consistency and easier styling compared to the native input[type="checkbox"].
 */
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
