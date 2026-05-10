import { Button } from '@shared/components/ui/Button/Button';
import { Text } from '@shared/components/ui/Text';
import { useNavigate } from 'react-router';
import type { MembersOnly } from '../types/membersOnly.types';

const MembersOnlyCard = ({ card }: { card: MembersOnly }) => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="bg-white rounded-lg border w-full flex flex-col h-full">
      <img
        src={`${apiBaseUrl}${card.imageUrl}`}
        alt={card.name}
        className="rounded-t-lg w-full h-40 object-cover"
      />
      <Text
        as="p"
        variant="body"
        weight="medium"
        color="text-black"
        className="pl-4 py-4 border-t border-purple flex-grow"
      >
        {card.name}
      </Text>
      <Text
        as="p"
        variant="caption"
        weight="regular"
        color="text-black"
        className="pl-4 pb-4"
      >
        {new Date(card.createdAt).toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
      <div className="flex flex-col items-center justify-center py-5 border-t border-purple ">
        <div className="w-3/7 md:w-3/7 lg:w-3/7 xl:w-3/7">
          <Button
            label="Ver"
            variant="purple"
            onClick={() => navigate(`/contenido-exclusivo/page/${card._id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default MembersOnlyCard;
