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
  error?: string;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  label,
  placeholder = 'Buscar dirección...',
  query,
  results,
  isLoading,
  onSearch,
  onSelect,
  error,
}) => {
  return (
    <div className="relative w-full">
      <div className="w-full border border-gray-400 rounded-lg px-2 py-1 bg-white focus-within:border-gray-600 transition-colors">
        <label className="block text-xs font-medium text-gray-400">
          {label}
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-700 text-sm"
        />
      </div>

      {isLoading && (
        <p className="text-xs text-gray-400 absolute mt-1 left-1">
          Buscando direcciones...
        </p>
      )}

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
      {error && (
        <Text
          variant="small"
          as="small"
          weight="bold"
          className="color-danger ml-1 italic"
        >
          {error}
        </Text>
      )}
    </div>
  );
};
