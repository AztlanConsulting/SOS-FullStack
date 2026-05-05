import { Button } from '@/shared/components/ui/Button/Button';
import { Text } from '@/shared/components/ui/Text/Text';
import { useNavigate } from 'react-router';
import type { PurchasedResourceResponse } from '@/features/graphs/types/dashboardMetrics';

export const PurchasedResourceCard = ({
  resource,
}: {
  resource: PurchasedResourceResponse;
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    console.log(resource);
    if (resource.type === 'manual') {
      navigate(`/manuales/${resource.id}`);
    } else {
      navigate(`/talleres/${resource.id}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 w-full">
        <img
          src={resource.imageUrl}
          alt={resource.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-purple-100 px-3 py-1 rounded-lg text-sm font-medium text-purple-primary shadow-sm capitalize">
          {resource.type === 'manual' ? 'Manual' : 'Taller'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <Text
          variant="body"
          weight="bold"
          className="mb-2 line-clamp-2 text-gray-900"
        >
          {resource.name}
        </Text>

        {resource.description && (
          <Text
            variant="caption"
            color="text-gray-500"
            className="mb-2 line-clamp-2"
          >
            {resource.description}
          </Text>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <Button label="Ver" variant="primary" onClick={handleView} />
      </div>
    </div>
  );
};
