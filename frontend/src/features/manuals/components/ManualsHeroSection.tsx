import { Text } from '@shared/components/ui/Text/Text';
import manualHero from '@/assets/images/manual-hero.jpg';

export const ManualsHeroSection = () => {
  return (
    <section className="bg-white w-full">
      <div className="flex flex-col items-center justify-center gap-6 my-6">
        <Text as="h1" variant="h1" weight="medium" color="text-black">
          Manuales
        </Text>
        <img
          src={manualHero}
          alt="Manuales"
          className="w-5/6 color-primary-shadow rounded-lg"
        />
        <Text as="p" variant="body" color="color-grey-text" className="w-5/6">
          Consulta nuestros manuales con información y herramientas útiles para
          el cuidado y protección de mascotas
        </Text>
      </div>
    </section>
  );
};
