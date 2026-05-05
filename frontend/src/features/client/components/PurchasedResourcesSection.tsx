import { Text } from '@/shared/components/ui/Text/Text';
import { PurchasedResourceCard } from './PurchasedResourceCard';
import { usePurchasedResources } from '../hooks/usePurchasedResources';
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

const FilterPill = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
        isActive
          ? 'bg-purple-100 border-purple-200 text-purple-800'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          isActive
            ? 'bg-white text-purple-700 shadow-sm'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {count}
      </span>
    </button>
  );
};
