import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import IntroPage from '../features/members-only/components/IntroPage';
import PdfSection from '../features/members-only/components/PdfSection';
import FaqSection from '../features/members-only/components/FaqSection';
import AudioSection from '../features/members-only/components/AudioSection';
import GoodToKnow from '../features/members-only/components/GoodToKnow';

const MembersOnly = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[72px] lg:pt-0">
        <IntroPage />
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
