import { useState, useMemo } from 'react';
import type { PurchasedResourceResponse } from '@/features/graphs/types/dashboardMetrics';

export type ResourceFilterType = 'todos' | 'workshop' | 'manual';

export const usePurchasedResources = (
  resources: PurchasedResourceResponse[],
) => {
  const [activeFilter, setActiveFilter] = useState<ResourceFilterType>('todos');

  const counts = useMemo(
    () => ({
      todos: resources.length,
      workshop: resources.filter((r) => r.type === 'workshop').length,
      manual: resources.filter((r) => r.type === 'manual').length,
    }),
    [resources],
  );

  const filteredResources = useMemo(() => {
    return resources.filter(
      (r) => activeFilter === 'todos' || r.type === activeFilter,
    );
  }, [resources, activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    counts,
    filteredResources,
  };
};
