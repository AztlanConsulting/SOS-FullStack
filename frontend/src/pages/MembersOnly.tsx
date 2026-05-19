import FaqSection from '../features/members-only/components/FaqSection';
import AudioSection from '../features/members-only/components/AudioSection';
import GoodToKnow from '../features/members-only/components/GoodToKnow';
import MembersOnlyListSection from '../features/members-only/components/MembersOnlyListSection';
import HeroSection from '@shared/components/layout/HeroSection';
import owner from '@assets/images/PortalExclusivo.png';
import { Text } from '@shared/components/ui/Text';
import { Button } from '@shared/components/ui/Button';
import { HiChevronRight } from 'react-icons/hi';
import { useNavigate } from 'react-router';

const MembersOnly = () => {
  const navigate = useNavigate();

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
                  En este espacio encontrarás contenido creado para ayudarte
                  durante la búsqueda. Reunimos guías, recomendaciones,
                  estrategias y recursos pensados para acompañarte en este
                  proceso y ayudarte a tomar decisiones más informadas y
                  efectivas. Sabemos que cada caso es único, por eso queremos
                  brindarte herramientas que puedan darte claridad, apoyo y
                  dirección en este momento.
                </Text>
                <Button
                  label="Completar Perfil de Búsqueda"
                  variant="purple"
                  icon={HiChevronRight}
                  onClick={() =>
                    navigate('/inicio/contenido-exclusivo/formulario')
                  }
                />
                <Text>
                  Cada mascota reacciona diferente al perderse. Conocer su
                  comportamiento nos ayuda a darte estrategias y recomendaciones
                  más precisas para enfocar mejor la búsqueda.
                </Text>
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
