import { useState } from 'react';
import { HiFilter } from 'react-icons/hi';
import { Text } from '@/shared/components/ui/Text';
import type { PlanStatus } from '../types/client.type';

/**
 * Interface defining the available filtering criteria for the client list.
 */
export interface ClientFilter {
  status?: PlanStatus; // Filter by the lifecycle of the plan
  conversation?: 'con' | 'sin'; // Filter by existence of a conversation link
}

interface Props {
  /** The current active filter state. */
  filters: ClientFilter;
  /** Callback function triggered when a filter is toggled or cleared. */
  onChange: (filters: ClientFilter) => void;
}

/**
 * Hardcoded options for plan status filtering.
 */
const STATUS_OPTIONS: { label: string; value: PlanStatus }[] = [
  { label: 'Continua', value: 'continua' },
  { label: 'Casi expira', value: 'casi expira' },
  { label: 'Expirado', value: 'expirado' },
  { label: 'RIP', value: 'RIP' },
];

/**
 *
 * A toggleable popover that allows users to refine the client list.
 * Features:
 * - Visual badge indicating the number of active filters.
 * - Multi-category filtering (Status and Conversation).
 * - "Clear filters" action to reset all parameters.
 */
export const FilterDropdown = ({ filters, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  // Calculate how many filters are currently applied to show in the badge
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 border rounded-md px-2 py-2 text-xs transition-colors ${
          activeCount > 0
            ? 'border-[#C2991D] text-[#C2991D] bg-[#F9CD48]/35'
            : 'border-gray-300 bg-white text-gray-600 hover:text-[#C2991D] hover:bg-[#F9CD48]/35 hover:border hover:border-[#C2991D]'
        }`}
      >
        <HiFilter size={14} />
        {activeCount > 0 && (
          <span className="bg-[#C2991D] text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-md z-10 p-3 flex flex-col gap-3">
          <div>
            <Text
              variant="small"
              weight="medium"
              color="text-gray-500"
              className="mb-2"
            >
              Estatus del plan
            </Text>
            <div className="flex flex-col gap-1">
              {STATUS_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() =>
                    onChange({
                      ...filters,
                      status: filters.status === value ? undefined : value,
                    })
                  }
                  className={`text-left text-xs px-2 py-1.5 rounded-md transition-colors ${
                    filters.status === value
                      ? 'bg-yellow-50 text-yellow-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <Text
              variant="small"
              weight="medium"
              color="text-gray-500"
              className="mb-2"
            >
              Conversación
            </Text>
            <div className="flex flex-col gap-1">
              {(['con', 'sin'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    onChange({
                      ...filters,
                      conversation:
                        filters.conversation === value ? undefined : value,
                    })
                  }
                  className={`text-left text-xs px-2 py-1.5 rounded-md transition-colors capitalize ${
                    filters.conversation === value
                      ? 'bg-yellow-50 text-yellow-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {value === 'con' ? 'Con conversación' : 'Sin conversación'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <button
            onClick={() => {
              onChange({});
              setOpen(false);
            }}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors text-left"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};
