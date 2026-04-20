import { HiOutlineSearch } from 'react-icons/hi';

interface Props {
  handleSearch: (s: string) => void;
}

const WorkshopSearchInput = ({ handleSearch }: Props) => {
  return (
    <div className="bg-white rounded-lg w-full h-10 flex flex-row justify-between items-center pl-3 color-grey-border">
      <input
        type="search"
        id="manuals-search"
        name="manuals-search"
        placeholder="Buscar..."
        onChange={(event) => handleSearch(event.target.value)}
        className="bg-transparent outline-none text-black placeholder-gray-500 w-full h-full"
      />
      <button
        type="submit"
        className="flex flex-row justify-end items-center h-full aspect-square"
      >
        <HiOutlineSearch
          color="black"
          size="100%"
          className="h-6 flex flex-row justify-end"
        />
      </button>
    </div>
  );
};

export default WorkshopSearchInput;
