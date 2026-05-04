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
          bg="bg-secondary"
          title={'¿Encontraste una mascota perdida?'}
          image={sadDog}
          content={`Si encontraste una mascota y no sabes qué hacer, estás en el lugar correcto. Ayuda a reunirla con su familia publicando la información aquí.`}
        />
        <PetReportForm initialData={{}} />
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;
