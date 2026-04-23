import { Text } from '@shared/components/ui/Text/Text';
import { HiChevronLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router';

export const HeaderBack = ({
  name,
  onBack,
}: {
  name: string;
  onBack?: () => void;
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate(-1);
  };

  return (
    <div className="w-full px-4 py-4 lg:py-[17px] flex items-center justify-start bg-white color-grey-border-bottom sticky top-0 z-50">
      <button
        onClick={handleBack}
        className="bg-white rounded-lg aspect-square flex flex-row justify-center items-center h-10 w-7"
      >
        <HiChevronLeft color="black" size="100%" className="aspect-square" />
      </button>
      <Text
        as="h3"
        variant="h3"
        weight="medium"
        color="text-black"
        className="w-full pl-5"
      >
        {name}
      </Text>
    </div>
  );
};
