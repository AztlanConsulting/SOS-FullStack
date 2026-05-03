import { Text } from '@shared/components/ui/Text';
import meditacion from '@assets/videos/meditacion.mp4';

const AudioSection = () => {
  return (
    <section
      id="lostpet-section"
      className="bg-white overflow-hidden py-8 lg:py-16 color-grey-border-bottom"
    >
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-x-8 md:gap-y-0">
          <Text
            as="h2"
            variant="h2"
            weight="medium"
            className="mb-3 md:order-2 text-center md:text-left md:row-span-1 md:place-self-end md:justify-self-start"
          >
            La búsqueda se convierte en un espejo: muestra nuestra paciencia,
            nuestra resiliencia, nuestra fe y nuestra capacidad de estar
            presentes.
          </Text>
          <video
            src={meditacion}
            className="object-cover rounded-lg w-full h-full md:order-1 md:row-span-2"
            controls
          />
          <Text
            variant="body"
            className="text-left md:order-3 md:row-span-1 md:place-self-start md:justify-self-start mt-3"
          >
            Cuando buscamos a nuestra mascota, nos enfrentamos a incertidumbre,
            miedo y ansiedad. Este proceso nos revela aspectos internos que
            normalmente permanecen ocultos.
          </Text>
        </div>
      </div>
    </section>
  );
};

export default AudioSection;
