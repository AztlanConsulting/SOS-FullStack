import React from 'react';
import { useLocationContext } from '@shared/context/Location.context';
import { Text } from '@shared/components/ui/Text';

const CurrencyIndicator: React.FC = () => {
  const { currencyCode, error } = useLocationContext();

  if (error) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white w-fit">
      <Text variant="small" className="text-gray-500">
        Precios en
      </Text>
      <Text variant="small" weight="medium" className="text-gray-800">
        {currencyCode}
      </Text>
    </div>
  );
};

export default CurrencyIndicator;
