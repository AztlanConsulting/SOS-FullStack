import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import FaqSection from '../features/members-only/components/FaqSection';
import AudioSection from '../features/members-only/components/AudioSection';
import GoodToKnow from '../features/members-only/components/GoodToKnow';
import MembersOnlyListSection from '../features/members-only/components/MembersOnlyListSection';
import HeroSection from '@shared/components/layout/HeroSection';
import owner from '@assets/images/members.png';
import { Text } from '@shared/components/ui/Text';

const MembersOnly = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[80.67px] lg:pt-0">
        <HeroSection
          bg="bg-light-purple"
          title={'Portal exclusivo'}
          image={owner}
          content={
            <Text>
              En el portal exclusivo de SOS ofrecemos recursos con instrucciones
              específicas de cómo afrontar este momento difícil.
            </Text>
          }
        />
        <MembersOnlyListSection />
        <AudioSection />
        <GoodToKnow />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default MembersOnly;
