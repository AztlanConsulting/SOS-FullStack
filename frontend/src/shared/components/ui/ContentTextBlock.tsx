import { Text } from './Text';
import { HiDocumentText, HiTrash } from 'react-icons/hi';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  maxLength?: number;
}

const ContentTextBlock = ({
  value,
  onChange,
  onDelete,
  maxLength = 2000,
}: Props) => {
  return (
    <div className="relative border border-gray-200 rounded-md p-3">
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        <HiTrash size={15} />
      </button>

      <div className="flex items-center gap-1 mb-2">
        <HiDocumentText size={13} className="text-gray-400" />
        <Text variant="small" color="text-gray-400">
          Texto
        </Text>
      </div>

      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe el contenido..."
        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none"
      />

      <Text
        variant="small"
        color="text-gray-400"
        className="text-right block mt-1"
      >
        {maxLength - value.length} caracteres restantes
      </Text>
    </div>
  );
};

export default ContentTextBlock;
