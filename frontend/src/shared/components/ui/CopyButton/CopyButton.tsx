import { useState } from 'react';
import { HiClipboardDocument, HiClipboardDocumentCheck } from 'react-icons/hi2';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label,
  className = '',
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 p-1 hover:bg-gray-100 rounded transition-colors ${className}`}
      title={label || 'Copiar'}
      aria-label={label || 'Copiar'}
    >
      {isCopied ? (
        <HiClipboardDocumentCheck className="w-4 h-4 text-green-600" />
      ) : (
        <HiClipboardDocument className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      )}
    </button>
  );
};
