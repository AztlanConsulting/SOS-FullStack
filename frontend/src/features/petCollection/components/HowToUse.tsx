import { Text } from '@/shared/components/ui/Text';
import lostDogs from '@/assets/images/lost-dogs.jpg';
import SelectImage from '@/assets/images/SelectImage.png';
import Gallery from '@/assets/images/Gallery.png';
import Filter from '@/assets/images/Filter.png';

const HowToUse = () => {
  return (
    <div>
      <section className="bg-purple-primary flex flex-col gap-5 w-full h-full items-center justify-center py-5">
        <Text variant="h1" weight="medium" color="text-white">
          Galería de mascotas
        </Text>
        <div className="flex flex-col items-center md:flex-row gap-5 md:w-10/12">
          <img
            src={lostDogs}
            alt=""
            className="rounded-c w-10/12 h-1/2 md:w-md"
          />
          <Text
            color="text-white"
            variant="h2"
            className="w-10/12 md:w-1/2 md:mx-auto"
          >
            ¡Alguien pudo haber visto a tu mascota! Este es el lugar donde
            podrías buscar si han habido avistamentos de tu mascota y poder
            contactar con la persona que lo encontró.
          </Text>
        </div>
      </section>
      <section className="flex flex-col gap-5 w-full h-full items-center justify-center py-5">
        <Text variant="h1" weight="medium">
          ¿Cómo funciona?
        </Text>
        <div className="flex md:gap-5 flex-col md:flex-row items-center">
          <img src={SelectImage} alt="" className="rounded-c w-10/12 h-1/2" />
          <div className="mt-2 md:mt-0 flex flex-col gap-2 items-center">
            <Text variant="h2" weight="medium" className="w-10/12 text-center">
              Sube una foto de tu mascota dando click en “Subir imagen”
            </Text>
            <Text className="w-10/12 text-center">
              Esta la puedes cambiar por si quieres probar con diferentes fotos.
            </Text>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-5 w-full h-full items-center justify-center py-5 bg-purple-secondary">
        <Text variant="h1" weight="medium">
          Explora la galería
        </Text>
        <div className="flex md:gap-5 flex-col md:flex-row-reverse items-center md:-ml-32">
          <img src={Gallery} alt="" className="rounded-c w-2/3 md:w-[30%]" />
          <div className="mt-2 md:mt-0 flex flex-col gap-2 items-center">
            <Text variant="h2" weight="medium" className="w-10/12 text-center">
              Busca entre las mascotas encontradas la tuya
            </Text>
            <Text className="w-10/12 text-center">
              Puede que no aparezca en la primera imagen, pero tal vez sí más
              adelante
            </Text>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-5 w-full h-full items-center justify-center py-5">
        <Text variant="h1" weight="medium">
          Busqueda customizada
        </Text>
        <div className="flex md:gap-5 flex-col md:flex-row items-center">
          <img src={Filter} alt="" className=" w-10/12 h-1/2" />
          <div className="mt-2 md:mt-0 flex flex-col gap-2 items-center">
            <Text variant="h2" weight="medium" className="w-10/12 text-center">
              Usa la sección de filtros para una búsqueda más precisa
            </Text>
            <Text className="w-10/12">
              Filtra por color, lugar o especie / tipo para buscar más
              facilmente
            </Text>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToUse;
