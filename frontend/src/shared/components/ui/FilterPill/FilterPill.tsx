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
          ? 'bg-[#dbd2e2] border-[#9880aa] shadow-sm'
          : 'bg-white border-[#cecece] hover:border-gray-300'
      }`}
    >
      <Text
        variant="caption"
        weight="medium"
        className={isActive ? 'text-[#9880aa]' : 'text-gray-600'}
      >
        {label}
      </Text>

      <span
        className={`flex items-center justify-center px-3 py-0.5 rounded-full ${
          isActive ? 'bg-white shadow-sm' : 'bg-[#cecece]'
        }`}
      >
        <Text
          variant="small"
          weight="bold"
          className={isActive ? 'text-purple-primary' : 'text-gray-500'}
        >
          {count}
        </Text>
      </span>
    </button>
  );
};
