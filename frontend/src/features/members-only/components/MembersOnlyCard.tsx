import { Button } from '@shared/components/ui/Button/Button';
import { Text } from '@shared/components/ui/Text';
import { useNavigate } from 'react-router';
import type { MembersOnlyContent } from '../types/membersOnly.types';

const MembersOnlyCard = ({ card }: { card: MembersOnlyContent }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-purple w-full flex flex-col h-full">
      <img
        src={card.imageUrl}
        alt={card.title}
        className="rounded-t-lg w-full h-40 object-cover"
      />
      <Text
        as="p"
        variant="body"
        weight="medium"
        color="text-black"
        className="pl-4 py-4 border-t border-purple flex-grow"
      >
        {card.title}
      </Text>
      <Text
        as="p"
        variant="caption"
        weight="regular"
        color="text-black"
        className="text-left pl-4 pb-4"
      >
        {card.description}
      </Text>
      <div className="w-full flex flex-col items-center justify-center py-5 border-t border-purple">
        <Button
          label="Ver"
          variant="purple"
          onClick={() => navigate(`/members-only/page/${card.id}`)}
        />
      </div>
    </div>
  );
};

export default MembersOnlyCard;
