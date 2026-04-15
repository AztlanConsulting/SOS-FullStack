import { Text } from '@shared/components/ui/Text';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
}

const WorkshopDropDown = ({ isOpen }: Props) => {
  const [sortOption, setSortOption] = useState('');
  return (
    isOpen && (
      <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-md w-56 z-50">
        {[
          'Nombre (A-Z)',
          'Nombre (Z-A)',
          'Precio: menor a mayor',
          'Precio: mayor a menor',
        ].map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 py-1 cursor-pointer hover:bg-(--color-grey-bg) py-2.5 px-3"
          >
            <input
              type="radio"
              name="sort"
              checked={sortOption === option}
              onChange={() => {
                setSortOption(option);
              }}
            />
            <Text
              as="caption"
              variant="caption"
              weight="regular"
              color="text-black"
            >
              {option}
            </Text>
          </label>
        ))}
      </div>
    )
  );
};

export default WorkshopDropDown;
