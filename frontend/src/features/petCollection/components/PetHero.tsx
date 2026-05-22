import { useNavigate } from 'react-router';
import type { PetInfoDetailed } from '../types/petCollection.types';
import { IoMdClose } from 'react-icons/io';

interface Props {
  petInfo: PetInfoDetailed;
}

const PetHero = ({ petInfo }: Props) => {
  const navigate = useNavigate();
  const image = `data:image/png;base64,${petInfo.image}`;

  return (
    <section className={`flex flex-col items-center justify-center`}>
      <button
        onClick={() => navigate('/inicio/coleccion-mascotas')}
        className="fixed top-3 md:top-1 left-3 md:right-108 bg-gray-800/90 rounded-full p-2 text-gray-200 hover:bg-gray-700/90 hover:shadow-sm hover:shadow-gray-400 size-9"
      >
        <IoMdClose className="mx-auto" />
      </button>
      <img src={image} alt="Manuales" className="object-contain  w-full " />
    </section>
  );
};

export default PetHero;
