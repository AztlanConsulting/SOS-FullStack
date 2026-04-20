import { Text } from '@shared/components/ui/Text';
import type { PaymentMethod } from '../types/PaymentMethod.type';

const PaymentMethodCard = ({ method, icons, description }: PaymentMethod) => {
  return (
    <label
      htmlFor={method}
      className="h-20 rounded-lg border-2 radius-c border-gray-300 flex align-middle items-center px-5"
    >
      <div className="w-full grid grid-cols-3">
        <div className="flex gap-2 col-span-2">
          <input type="radio" name="method" id={method} value={method} />
          <div>
            <Text className="text-sm md:text-base">{method}</Text>
            <Text color="text-gray-500" className="text-[10px] md:text-sm">
              {description}
            </Text>
          </div>
        </div>
        <div className="flex gap-2 items-center justify-center w-full">
          {icons.map((i) => (
            <img src={i} className="h-6" />
          ))}
        </div>
      </div>
    </label>
  );
};

export default PaymentMethodCard;
