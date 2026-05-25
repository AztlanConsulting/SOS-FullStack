import { HiSearch } from 'react-icons/hi';

interface Props {
  /** The current string value of the search input. */
  value: string;
  /** Callback function that updates the state as the user types. */
  onChange: (value: string) => void;
}

/**
 * ClientSearch Component.
 *
 * A specialized input field for filtering the client list by name.
 * Designed to be compact and consistent with the admin dashboard aesthetics.
 *
 * Features:
 * - Built-in search icon.
 * - Borderless internal input for a cohesive "box" look.
 * - Responsive width (fixed at 14rem/w-56) suitable for header toolbars.
 */
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
