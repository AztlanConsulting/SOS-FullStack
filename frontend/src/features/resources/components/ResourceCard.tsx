import { Text } from '@shared/components/ui/Text';
import type { Resource } from '../types/resource';

const ResourceCard = ({
  resource,
  onClick,
}: {
  resource: Resource;
  onClick?: (resource: Resource) => void;
}) => {
  return (
    <div
      key={resource._id}
      className="bg-white rounded-lg color-grey-border-left color-grey-border-right color-grey-border-bottom w-full flex flex-col h-full px-4 border-t-4 border-[#CFAC42] cursor-pointer"
      onClick={() => onClick?.(resource)}
    >
      {resource.type === 'Taller' ? (
        <button className="bg-[#BDE0FE] px-5 py-1 mt-4 w-fit rounded-lg">
          <Text variant="caption" as="p" weight="medium" color="text-[#2856B1]">
            {' '}
            Taller{' '}
          </Text>
        </button>
      ) : (
        <button className="bg-[#D4C7DB] px-5 py-1 mt-4 w-fit rounded-lg">
          <Text variant="caption" as="p" weight="medium" color="text-[#673881]">
            {' '}
            Manual{' '}
          </Text>
        </button>
      )}
      <Text
        variant="h3"
        weight="medium"
        color="text-black"
        className="pt-3 flex-grow"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
        }}
      >
        {resource.name}
      </Text>
      <Text
        variant="body"
        as="p"
        color="text-black"
        className="mb-4 pt-3 flex-grow"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
        }}
      >
        {resource.content.map((content) => {
          if (content.type === 'text') {
            return content.content;
          }
          return null;
        })}
      </Text>
      <div className="w-full flex justify-between items-center color-grey-border-top">
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-gray-500"
          className="text-left py-2"
        >
          Precio
        </Text>
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-gray-500"
          className="text-right py-2"
        >
          ${resource.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} USD
        </Text>
      </div>
    </div>
  );
};

export default ResourceCard;
