import React from 'react';
import { Text } from '../Text';

interface SearchResult {
  displayName: string;
  coords: [number, number];
}

interface LocationSearchInputProps {
  label: string;
  placeholder?: string;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  onSearch: (value: string) => void;
  onSelect: (result: SearchResult) => void;
  onFocus?: () => void;
  error?: string;
  maxLength?: number;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  label,
  placeholder = 'Buscar dirección...',
  query,
  results,
  isLoading,
  onSearch,
  onSelect,
  onFocus,
  error,
  maxLength = 200,
}) => {
  const hasErrorState = Boolean(error);
  const inputValue = query.slice(0, maxLength);
  const remaining = maxLength - inputValue.length;

  return (
    <div className="relative w-full">
      <div
        className={`group w-full border rounded-lg px-2 py-1 bg-white focus-within:ring-1 group ${
          hasErrorState
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
            : 'border-gray-400 focus-within:border-yellow-500 focus-within:ring-yellow-500'
        }`}
      >
        <label
          className={`block text-sm font-medium text-gray-400 ${hasErrorState ? 'group-focus-within:text-red-500' : 'group-focus-within:text-[var(--color-primary)]'}`}
        >
          {label}
        </label>
        <input
          type="text"
          value={inputValue}
          onFocus={onFocus}
          onChange={(e) => onSearch(e.target.value.slice(0, maxLength))}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-700 text-base"
        />
      </div>

      <div
        className={`mt-1 flex items-start gap-2 ${hasErrorState || isLoading ? 'justify-between' : 'justify-end'}`}
      >
        {isLoading && (
          <p className="w-full text-xs text-gray-400">
            Buscando direcciones...
          </p>
        )}
        {!isLoading && error && (
          <Text
            variant="small"
            as="small"
            weight="regular"
            className="ml-1 color-danger italic"
          >
            {error}
          </Text>
        )}
        <Text
          variant="caption"
          as="span"
          weight="medium"
          className="shrink-0 text-right text-emerald-700"
        >
          Quedan {remaining} caracteres
        </Text>
      </div>

      {results.length > 0 && (
        <ul className="absolute top-[105%] left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-2 max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => onSelect(r)}
              className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
            >
              {r.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
