import { Text } from '@shared/components/ui/Text';

interface Props {
  isOpen: boolean;
  sortHook: [
    sortOption: string,
    setSortOption: React.Dispatch<React.SetStateAction<string>>,
  ];
  typeHook: [
    typeOption: string,
    setTypeOption: React.Dispatch<React.SetStateAction<string>>,
  ];
  onlyAlphabetic?: boolean;
}

const DropDown = ({ isOpen, sortHook, typeHook, onlyAlphabetic }: Props) => {
  const sortOption = sortHook[0];
  const setSortOption = sortHook[1];
  const typeOption = typeHook[0];
  const setTypeOption = typeHook[1];

  const sortOptions = [
    {
      label: 'Nombre (A-Z)',
      value: 'Nombre (A-Z)',
    },
    {
      label: 'Nombre (Z-A)',
      value: 'Nombre (Z-A)',
    },
    {
      label: 'Precio: menor a mayor',
      value: 'Precio: menor a mayor',
    },
    {
      label: 'Precio: mayor a menor',
      value: 'Precio: mayor a menor',
    },
  ];

  const filteredSortOptions = onlyAlphabetic
    ? sortOptions.slice(0, 2)
    : sortOptions;

  const typeOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Taller', value: 'Taller' },
    { label: 'Manual', value: 'Manual' },
  ];

  return (
    isOpen && (
      <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-md w-72 z-50 overflow-hidden">
        <div className="pt-4">
          <Text
            as="p"
            variant="caption"
            weight="medium"
            color="text-black"
            className="px-4 mb-2 uppercase tracking-wide text-gray-500"
          >
            Ordenar
          </Text>

          {filteredSortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-(--color-grey-bg) py-2.5 px-4"
            >
              <input
                type="radio"
                name="sort"
                checked={sortOption === option.value}
                onChange={() => {
                  setSortOption(option.value);
                }}
              />
              <Text
                as="span"
                variant="caption"
                weight="regular"
                color="text-black"
              >
                {option.label}
              </Text>
            </label>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Text
            as="p"
            variant="caption"
            weight="medium"
            color="text-black"
            className="px-4 mb-2 uppercase tracking-wide text-gray-500"
          >
            Tipo
          </Text>

          {typeOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-(--color-grey-bg) py-2.5 px-4"
            >
              <input
                type="radio"
                name="type"
                checked={typeOption === option.value}
                onChange={() => {
                  setTypeOption(option.value);
                }}
              />
              <Text
                as="span"
                variant="caption"
                weight="regular"
                color="text-black"
              >
                {option.label}
              </Text>
            </label>
          ))}
        </div>
      </div>
    )
  );
};

export default DropDown;
