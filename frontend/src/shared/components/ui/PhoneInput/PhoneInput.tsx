import React from 'react';
import { PhoneInput as ReactInternationalPhone } from 'react-international-phone';
import 'react-international-phone/style.css';

interface PhoneInputProps {
  label: string;
  value: string;
  id: string;
  onChange: (value: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  id,
  value,
  onChange,
}) => {
  return (
    <div
      className="w-full border border-gray-400 rounded-lg px-2 py-1 bg-white focus-within:border-gray-600 transition-colors flex flex-col"
      id={id}
    >
      <label className="block text-xs font-medium text-gray-400">{label}</label>

      <div className="text-sm text-gray-700 w-full flex items-center">
        <ReactInternationalPhone
          defaultCountry="mx"
          value={value}
          onChange={(phone) => onChange(phone)}
          forceDialCode={true}
          inputClassName="!border-none !bg-transparent !text-sm !text-gray-700 !w-full focus:!ring-0 !p-0 !pl-3 !outline-none hover:!bg-transparent"
          countrySelectorStyleProps={{
            buttonClassName:
              '!border-none !bg-transparent !p-0 !pr-3 hover:!bg-transparent',
            buttonContentWrapperClassName: 'border-r border-gray-300 pr-3',
          }}
        />
      </div>
    </div>
  );
};
