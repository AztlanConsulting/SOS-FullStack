import { HiOutlineSearch } from 'react-icons/hi';
import { HiOutlineFilter } from 'react-icons/hi';
import { useManualsListSection } from '../hooks/useManualsListSection';
import { ManualItem } from './ManualItem';
import type { Manual } from '../types/Manual.type';

export const ManualsListSection = () => {
  const { manuals, loading, error } = useManualsListSection();

  if (loading) {
    return (
      <section className="color-secondary-bg w-full p-10 text-center text-black">
        <p>Cargando manuales...</p>
      </section>
    );
  }

  if (error) {
    console.error(error);
    return (
      <section className="color-secondary-bg w-full p-10 text-center text-black">
        <p>Error al cargar los manuales.</p>
      </section>
    );
  }

  if (manuals.length === 0) {
    return (
      <section className="color-secondary-bg w-full p-10 text-center text-black">
        <p>No se encontraron manuales.</p>
      </section>
    );
  }

  return (
    <section className="color-secondary-bg w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        <div className="flex flex-row justify-center items-center gap-2 my-8 w-full md:w-1/3 md:place-self-end">
          <div className="bg-white rounded-lg h-10 aspect-square flex flex-row justify-center items-center color-grey-border">
            <HiOutlineFilter color="black" size="100%" className="h-6" />
          </div>
          <div className="bg-white rounded-lg w-full h-10 flex flex-row justify-between items-center pl-3 color-grey-border">
            <input
              type="search"
              id="manuals-search"
              name="manuals-search"
              placeholder="Buscar..."
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-5">
          {manuals.map((manual: Manual) => (
            <ManualItem key={manual._id} manual={manual} />
          ))}
        </div>
      </div>
    </section>
  );
};
