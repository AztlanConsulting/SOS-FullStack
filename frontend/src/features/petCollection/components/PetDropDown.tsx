import { Button } from '@/shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  handleSearch: (k: string, v: string) => void;
}

const PetDropDown = ({ isOpen, handleSearch }: Props) => {
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');
  const [species, setSpecies] = useState('');

  function search() {
    handleSearch('color', color);
    handleSearch('location', location);
    handleSearch('species', species);
  }

  function clean() {
    setColor('');
    setLocation('');
    setSpecies('');
  }

  return (
    isOpen && (
      <div className="absolute top-12 p-2 right-0 bg-white border rounded-lg shadow-md w-80 z-50">
        <div className="gap-2 py-2">
          <label htmlFor="color">
            <Text
              variant="h3"
              color="text-purple-primary"
              className="text-center"
            >
              Color
            </Text>
          </label>
          <input
            type="text"
            id="color"
            className="border-[1px] p-1 rounded-lg border-gray-600 col-span-2"
            placeholder="Cafe..."
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <label htmlFor="location">
            <Text
              variant="h3"
              color="text-purple-primary"
              className="text-center"
            >
              Lugar
            </Text>
          </label>
          <input
            type="text"
            id="location"
            className="border-[1px] p-1 rounded-lg border-gray-600 col-span-2"
            placeholder="México..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label htmlFor="location">
            <Text
              variant="h3"
              color="text-purple-primary"
              className="text-center"
            >
              Tipo
            </Text>
          </label>
          <input
            type="text"
            id="species"
            className="border-[1px] p-1 rounded-lg border-gray-600 col-span-2"
            placeholder="Pug..."
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-8 h-7">
          <FilterButton onClick={clean} content="Borrar" cancel />
          <FilterButton onClick={search} content="Buscar" />
        </div>
      </div>
    )
  );
};

interface ButtonProps {
  onClick: () => void;
  content: string;
  cancel?: boolean;
}
function FilterButton({ onClick, content, cancel }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full ${cancel ? 'bg-white border-purple-primary hover:bg-purple-secondary text-purple-primary' : 'bg-purple-primary border-purple-primary hover:bg-purple-secondary text-white hover:text-purple-primary'} border-[1px]  items-center w-full cursor-pointer`}
    >
      <Text variant="caption" weight="medium" className="text-inherit">
        {content}
      </Text>
    </button>
  );
}

export default PetDropDown;
