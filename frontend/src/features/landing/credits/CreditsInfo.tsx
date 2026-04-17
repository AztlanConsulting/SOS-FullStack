import { Text } from '../../../shared/components/ui/Text';

const CreditsInfo = () => {
  return (
    <section className="relative color-secondary-bg border-b border-(--color-grey-border) py-12 lg:py-20">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className=" lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="text-center mb-6 lg:mb-10">
            <Text as="h2" variant="h2" weight="medium">
              Creditos de imagenes
            </Text>
          </div>
          <div className="flex-1 max-w-xl lg:max-w-2xl order-2 lg:order-1 text-left">
            <Text variant="body" weight="regular">
              Esta sección reconoce a los autores y fuentes de las imágenes
              utilizadas en este sitio, en cumplimiento con sus respectivas
              licencias.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditsInfo;
