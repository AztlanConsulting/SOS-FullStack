import { Text } from '@/shared/components/ui/Text/Text';
import { PurchasedResourceCard } from './PurchasedResourceCard';
import type { PurchasedResourceResponse } from '@/features/graphs/types/dashboardMetrics';

interface PurchasedResourcesSectionProps {
  resources: PurchasedResourceResponse[];
}

export const PurchasedResourcesSection = ({
  resources,
}: PurchasedResourcesSectionProps) => {
  return (
    <div className="flex flex-col gap-5 h-full">
      <Text variant="h2" weight="bold" className="text-gray-900">
        Tus recursos
      </Text>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <PurchasedResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full flex flex-col items-center justify-center">
          <Text variant="body" color="text-gray-500">
            Aún no tienes recursos comprados.
          </Text>
        </div>
      )}
    </div>
  );
};
