import { Text } from '../../../../shared/components/ui/Text';
import experiencia from '@assets/images/experiencia.png';

const PlansSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse items-center lg:justify-between gap-8 lg:gap-12">
          <div className="">
            <img
              src={experiencia}
              alt="Planes"
              className="w-full max-w-[250px] h-auto rounded-lg"
            />
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1 lg:order-2">
            <Text as="h2" variant="h3" weight="medium" className="mb-4 lg:mb-6">
              Especialistas en dicusion de mascotas extraviadas.
            </Text>
            <Text variant="body" className="text-left">
              Las primeras horas son clave. Activamos campañas de difusión
              geolocalizadas en minutos. La red de búsqueda más grande,
              trabajando para ti.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
