import FaqSection from '../features/members-only/components/FaqSection';
import AudioSection from '../features/members-only/components/AudioSection';
import GoodToKnow from '../features/members-only/components/GoodToKnow';
import MembersOnlyListSection from '../features/members-only/components/MembersOnlyListSection';
import HeroSection from '@shared/components/layout/HeroSection';
import owner from '@assets/images/PortalExclusivo.webp';
import { Text } from '@shared/components/ui/Text';
import { Button } from '@shared/components/ui/Button';
import { HiChevronRight } from 'react-icons/hi';
// import { useNavigate } from 'react-router';

const MembersOnly = () => {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <main className="pt-[80.67px] lg:pt-0">
        <HeroSection
          bg="bg-light-purple"
          title={'Contenido Exclusivo'}
          image={owner}
          shadowClass="color-light-purple-shadow"
          content={
            <>
              <div className="flex flex-col gap-4">
                <Text>
                  Aquí encontrarás guías, estrategias y recursos diseñados para
                  apoyarte en la búsqueda y ayudarte a tomar decisiones más
                  claras y efectivas. Completa el perfil de búsqueda a
                  continuación para poderte ofrecer recomendaciones
                  personalizadas según el comportamiento de tu mascota para
                  enfocar mejor la búsqueda.
                </Text>
                <a
                  href="https://www.sosencontrandomascotas.com/etologia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    label="Completar Perfil de Búsqueda"
                    variant="purple"
                    icon={HiChevronRight}
                  />
                </a>
              </div>
            </>
          }
        />
        <MembersOnlyListSection />
        <AudioSection />
        <GoodToKnow />
        <FaqSection />
      </main>
    </div>
  );
};

export default MembersOnly;
