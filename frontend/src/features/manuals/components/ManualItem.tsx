import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import { useNavigate } from 'react-router';
import type { Manual } from '../types/Manual.type';
import { formatCurrency } from '@shared/utils/formatCurrency';

export const ManualItem = ({
  manual,
  localizedPrice,
  currencyCode,
}: {
  manual: Manual;
  localizedPrice?: number;
  currencyCode?: string;
}) => {
  const navigate = useNavigate();
  const displayPrice = localizedPrice ?? manual.price;
  const displayCurrency = currencyCode ?? 'USD';
  return (
    <div
      key={manual._id}
      className="bg-white rounded-lg color-grey-border w-full flex flex-col h-full"
    >
      <img
        src={manual.imageUrl}
        alt={manual.name}
        className="rounded-t-lg w-full h-40 sm:h-60 md:h-40 object-cover"
      />
      <Text
        as="p"
        variant="body"
        weight="medium"
        color="text-black"
        className="pl-4 py-4 color-grey-border-top flex-grow"
      >
        {manual.name}
      </Text>
      <div className="w-full flex justify-between align-items">
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="text-left pl-4 pb-4"
        >
          Precio
        </Text>
        <div className="flex items-baseline gap-1.5 pr-4 pb-4">
          <Text as="p" variant="body" weight="regular" color="text-black">
            {formatCurrency(displayPrice, displayCurrency)}
          </Text>
          <Text
            as="p"
            variant="small"
            color="text-black"
            className="text-gray-800"
          >
            {displayCurrency}
          </Text>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center py-5 color-grey-border-top">
        <Button
          label="Ver"
          variant="plans"
          onClick={() =>
            navigate(`/manuales/${manual._id}`, { state: { manual } })
          }
        />
      </div>
    </div>
  );
};
