import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import FaqSection from '../features/members-only/components/FaqSection';
import AudioSection from '../features/members-only/components/AudioSection';
import GoodToKnow from '../features/members-only/components/GoodToKnow';
import MembersOnlyListSection from '../features/members-only/components/MembersOnlyListSection';
import HeroSection from '@shared/components/layout/HeroSection';
import owner from '@assets/images/members.png';
import { Text } from '@shared/components/ui/Text';
import { Button } from '@shared/components/ui/Button';
import { HiChevronRight } from 'react-icons/hi';
import { useNavigate } from 'react-router';

const MembersOnly = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header accentBg="color-purple-bg" />
      <main className="pt-[80.67px] lg:pt-0">
        <HeroSection
          bg="bg-light-purple"
          title={'Portal exclusivo'}
          image={owner}
          content={
            <>
              <div className="flex flex-col gap-4">
                <Text>
                  En el portal exclusivo de SOS ofrecemos recursos con
                  instrucciones específicas de cómo afrontar este momento
                  difícil.
                </Text>
                <Button
                  label="Perdí mi mascota"
                  variant="purple"
                  icon={HiChevronRight}
                  onClick={() => navigate('/portal-exclusivo/formulario')}
                />
              </div>
            </>
          }
        />
        <MembersOnlyListSection />
        <AudioSection />
        <GoodToKnow />
        <FaqSection />
      </main>
      <Footer bg="color-purple-bg" />
    </div>
  );
};

export default MembersOnly;
