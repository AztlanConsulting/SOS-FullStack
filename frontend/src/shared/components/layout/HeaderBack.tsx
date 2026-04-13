import { Text } from '@shared/components/ui/Text/Text';
import { HiChevronLeft } from 'react-icons/hi2';

export const HeaderBack = ({ name }: { name: string }) => {
  return (
    <div className="w-full flex items-center justify-start bg-white color-grey-border-bottom">
      <button className="bg-white rounded-lg aspect-square flex flex-row justify-center items-center h-full w-1/8">
        <HiChevronLeft
          color="black"
          size="100%"
          className="h-7 aspect-square"
        />
      </button>
      <Text
        as="h3"
        variant="h3"
        weight="medium"
        color="text-black"
        className="w-full py-5"
      >
        {name}
      </Text>
    </div>
  );
};
