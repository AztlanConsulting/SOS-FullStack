import { Text } from './Text';
import { HiDocumentText, HiTrash } from 'react-icons/hi';

interface Props {
  edit: boolean;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onDelete: () => void;
  maxLength?: number;
}

const ContentTextBlock = ({
  edit,
  value,
  error,
  onChange,
  onDelete,
  maxLength = 2000,
}: Props) => {
  if (!edit)
    return (
      <Text variant="body" color="text-black" className="mb-2 break-words">
        {value}
      </Text>
    );
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
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe el contenido..."
        className={
          'w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none' +
          (error ? ' border-red-500' : 'border-gray-200')
        }
      />
      {error && (
        <Text variant="small" color="text-red-500">
          error
        </Text>
      )}
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
