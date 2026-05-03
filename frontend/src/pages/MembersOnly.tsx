import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import PdfSection from '../features/members-only/components/PdfSection';
import FaqSection from '../features/members-only/components/FaqSection';
import AudioSection from '../features/members-only/components/AudioSection';
import GoodToKnow from '../features/members-only/components/GoodToKnow';
import HeroSection from '@shared/components/layout/HeroSection';
import owner from '@assets/images/members.png';
import { Text } from '@shared/components/ui/Text';
import { HiChevronRight } from 'react-icons/hi2';
import { Button } from '@/shared/components/ui/Button/Button';
import { Link } from 'react-router';

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
            <div className="flex flex-col justify-between gap-8">
              <Text>
                En el portal exlusivo de SOS ofrecemos recursos con
                instrucciones especificas de como afrontar este momento dificil.
              </Text>
              <div className="flex flex-col w-full ">
                <Link to="/members-only/formulario">
                  <Button
                    label="Formulario de búsqueda"
                    variant="purple"
                    icon={HiChevronRight}
                  />
                </Link>
              </div>
            </div>
          }
        />
        <PdfSection />
        <AudioSection />
        <GoodToKnow />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default MembersOnly;
