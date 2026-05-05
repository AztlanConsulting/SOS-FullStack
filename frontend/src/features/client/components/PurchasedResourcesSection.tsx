import { Text } from '@/shared/components/ui/Text/Text';
import { PurchasedResourceCard } from './PurchasedResourceCard';
import { usePurchasedResources } from '../hooks/usePurchasedResources';
import { FilterPill } from '@/shared/components/ui/FilterPill/FilterPill';
import type { PurchasedResourceResponse } from '@/features/graphs/types/dashboardMetrics';

interface PurchasedResourcesSectionProps {
  resources: PurchasedResourceResponse[];
}

export const PurchasedResourcesSection = ({
  resources,
}: PurchasedResourcesSectionProps) => {
  const { activeFilter, setActiveFilter, counts, filteredResources } =
    usePurchasedResources(resources);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col items-center md:items-start gap-4">
        <Text variant="h3" weight="medium">
          Recursos comprados
        </Text>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <FilterPill
            label="Todos"
            count={counts.todos}
            isActive={activeFilter === 'todos'}
            onClick={() => setActiveFilter('todos')}
          />
          <FilterPill
            label="Talleres"
            count={counts.workshop}
            isActive={activeFilter === 'workshop'}
            onClick={() => setActiveFilter('workshop')}
          />
          <FilterPill
            label="Manuales"
            count={counts.manual}
            isActive={activeFilter === 'manual'}
            onClick={() => setActiveFilter('manual')}
          />
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <PurchasedResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full flex flex-col items-center justify-center">
          <Text variant="body" color="text-gray-500">
            Aún no tienes recursos de este tipo.
          </Text>
        </div>
      )}
    </div>
  );
};
