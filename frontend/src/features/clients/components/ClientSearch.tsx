import { HiSearch } from 'react-icons/hi';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const ClientSearch = ({ value, onChange }: Props) => {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-4 py-2 w-56 bg-white">
      <HiSearch className="text-gray-400 shrink-0" size={14} />
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none border-none text-xs w-full bg-transparent text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};
