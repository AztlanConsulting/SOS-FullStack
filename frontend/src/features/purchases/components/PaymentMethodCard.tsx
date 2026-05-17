import { Text } from '@shared/components/ui/Text';
import type { PaymentMethod } from '../types/PaymentMethod.type';
import type { ChangeEvent } from 'react';

interface Props {
  paymentMethod: PaymentMethod;
  onChecked: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

const PaymentMethodCard = ({ paymentMethod, onChecked }: Props) => {
  const { method, description, icons } = paymentMethod;
  return (
    <label
      htmlFor={method}
      className="min-h-20 rounded-lg border-2 border-gray-300 flex align-middle items-center px-3 mb-2"
    >
      <div className="w-full grid grid-cols-3">
        <div className="flex gap-2 col-span-2 py-2">
          <input
            type="radio"
            name="method"
            id={method}
            value={method}
            onChange={onChecked}
          />
          <div>
            <Text variant="body" weight="regular">
              {method}
            </Text>
            <Text
              color="text-gray-500"
              variant="small"
              as="p"
              className="text-[10px] md:text-sm"
            >
              {description}
            </Text>
          </div>
        </div>
        <div className="flex gap-1 items-center justify-center w-full col-span-1">
          {icons.map((i, idx) => (
            <img key={idx} src={i} className="h-4" />
          ))}
        </div>
      </div>
    </label>
  );
};

export default PaymentMethodCard;
