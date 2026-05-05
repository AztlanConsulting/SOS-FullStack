import { Text } from '@/shared/components/ui/Text/Text';

interface FilterPillProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export const FilterPill = ({
  label,
  count,
  isActive,
  onClick,
}: FilterPillProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-1 rounded-lg border transition-colors ${
        isActive
          ? 'bg-purple-200 border-purple-400'
          : 'bg-white border-gray-300 hover:bg-gray-50'
      }`}
    >
      <Text
        variant="caption"
        weight="medium"
        color={isActive ? 'text-purple-primary' : 'text-gray-600'}
      >
        {label}
      </Text>

      <span
        className={`flex items-center justify-center px-2 py-0.5 rounded-lg shadow-sm ${
          isActive ? 'bg-white' : 'bg-gray-200'
        }`}
      >
        <Text
          variant="small"
          weight="bold"
          color={isActive ? 'text-purple-primary' : 'text-gray-500'}
        >
          {count}
        </Text>
      </span>
    </button>
  );
};
