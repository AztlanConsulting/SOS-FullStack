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
  return (
    <div
      className="w-full border border-gray-400 rounded-lg px-2 py-1 bg-white focus-within:border-gray-600 transition-colors flex flex-col"
      id={id}
    >
      <label htmlFor={id} className="block text-xs font-medium text-gray-400">
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
