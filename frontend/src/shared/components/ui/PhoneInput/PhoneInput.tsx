import React from 'react';
import { Text } from '../Text';
import { PhoneInput as ReactInternationalPhone } from 'react-international-phone';
import 'react-international-phone/style.css';

interface PhoneInputProps {
  label: string;
  value: string;
  id: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  id,
  value,
  onChange,
  error,
}) => {
  const hasErrorState = Boolean(error);

  return (
    <div className="flex flex-col w-full">
      <div
        className={`group w-full border border-gray-400 rounded-lg px-2 pt-1 bg-white focus-within:ring-1 group ${
          hasErrorState
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
            : 'border-gray-400 focus-within:border-yellow-500 focus-within:ring-yellow-500'
        } flex flex-col`}
        id={id}
      >
        <label
          htmlFor={id}
          className={`block text-xs text-gray-400 ${hasErrorState ? 'group-focus-within:text-red-500' : 'group-focus-within:text-[var(--color-primary)]'}`}
        >
          {label}
        </label>
        <div className="text-sm text-gray-700 w-full flex items-center">
          <ReactInternationalPhone
            defaultCountry="mx"
            value={value}
            onChange={(phone) => onChange(phone)}
            forceDialCode={true}
            className="w-full"
            inputClassName="!border-none !bg-transparent !text-sm !text-gray-700 !w-full focus:!ring-0 !p-0 !pl-3 !outline-none hover:!bg-transparent"
            inputProps={{
              id: id,
            }}
            countrySelectorStyleProps={{
              buttonClassName:
                '!border-none !bg-transparent !p-0 !pr-3 hover:!bg-transparent',
              buttonContentWrapperClassName: 'border-r border-gray-300 pr-3',
            }}
          />
        </div>
      </div>
      {error && (
        <Text
          variant="small"
          as="small"
          weight="regular"
          className="color-danger ml-1 italic"
        >
          {error}
        </Text>
      )}
    </div>
  );
};
