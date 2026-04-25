import React from 'react';

type DistributionOption = 1 | 2 | 3 | 4;

interface PhotoDistributionPickerProps {
  value: DistributionOption;
  onChange: (value: DistributionOption) => void;
}

const optionsConfig = [
  {
    value: 1 as DistributionOption,
    label: '1 foto \u00A0',
    icon: <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />,
  },
  {
    value: 2 as DistributionOption,
    label: '2 fotos',
    icon: (
      <>
        <rect x="3" y="3" width="8" height="18" rx="1" strokeWidth="1.5" />
        <rect x="13" y="3" width="8" height="18" rx="1" strokeWidth="1.5" />
      </>
    ),
  },
  {
    value: 3 as DistributionOption,
    label: '3 fotos',
    icon: (
      <>
        <rect x="3" y="3" width="8" height="18" rx="1" strokeWidth="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1" strokeWidth="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1" strokeWidth="1.5" />
      </>
    ),
  },
  {
    value: 4 as DistributionOption,
    label: '4 fotos',
    icon: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1" strokeWidth="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1" strokeWidth="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1" strokeWidth="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1" strokeWidth="1.5" />
      </>
    ),
  },
];

export const PhotoDistributionPicker: React.FC<
  PhotoDistributionPickerProps
> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {optionsConfig.map((option) => {
        const isActive = option.value === value;

        const buttonClasses = isActive
          ? 'border-2 border-yellow-500 bg-white text-yellow-500'
          : 'border border-gray-400 bg-white text-gray-600 hover:border-gray-500';

        const iconColor = isActive ? 'stroke-yellow-500' : 'stroke-gray-600';

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`${buttonClasses} rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-all active:scale-[0.98]`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={iconColor}
            >
              {option.icon}
            </svg>
            <span
              className={`text-sm font-medium ${isActive ? 'text-yellow-600' : 'text-gray-700'}`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
