import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import HeroSection from '@shared/components/layout/HeroSection';
import { PetReportForm } from '@features/found-pet/components/PetReportForm';
import sadDog from '@assets/images/sadDog.png';

const CreditsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-[80.67px] lg:pt-0">
        <HeroSection
          bg="bg-white"
          title={'Blog'}
          image={sadDog}
          content={`En nuestro blog encontrarás información, consejos y recursos para prevenir y actuar ante la pérdida de una mascota.`}
        />
        <PetReportForm initialData={{}} />
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;
