import { Button } from '@shared/components/ui/Button/Button';
import { Text } from '@shared/components/ui/Text';
import { useNavigate } from 'react-router';
import type { Workshop } from '../types/workshop';

const WorkshopCard = ({ workshop }: { workshop: Workshop }) => {
  const navigate = useNavigate();
  return (
    <div
      key={workshop._id}
      className="bg-white rounded-lg color-grey-border w-full flex flex-col h-full"
    >
      <img
        src={workshop.imageUrl}
        alt={workshop.name}
        className="rounded-t-lg w-full h-40 object-cover"
      />
      <Text
        as="p"
        variant="body"
        weight="medium"
        color="text-black"
        className="pl-4 py-4 color-grey-border-top flex-grow"
      >
        {workshop.name}
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
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="text-right pr-4 pb-4"
        >
          $ {workshop.price}
        </Text>
      </div>
      <div className="w-full flex flex-col items-center justify-center py-5 color-grey-border-top">
        <Button
          label="Ver"
          variant="plans"
          onClick={() =>
            navigate(`/talleres/${workshop._id}`, { state: { workshop } })
          }
        />
      </div>
    </div>
  );
};

export default WorkshopCard;
