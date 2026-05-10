import { useNavigate } from 'react-router';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import HeroSection from '@shared/components/layout/HeroSection';
import { PetReportForm } from '@features/found-pet/components/PetReportForm';
import sadDog from '@assets/images/sadDog.png';

const CreditsPage = () => {
  const navigate = useNavigate();

  const handleScrollToReport = () => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById('lostpet-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-4 gap-4 pt-[80.67px] lg:pt-0">
        <HeroSection
          bg="bg-secondary"
          title={'¿Encontraste una mascota perdida?'}
          image={sadDog}
          content={`Si encontraste una mascota y no sabes qué hacer, estás en el lugar correcto. Ayuda a reunirla con su familia publicando la información aquí.`}
          buttonText={'Perdí mi mascota'}
          onClick={handleScrollToReport}
        />
        <div id="found-pet-form">
          <PetReportForm initialData={{}} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;
