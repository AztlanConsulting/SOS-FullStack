import WorkshopListSection from '@features/workshop/components/WorkshopListSection';
import Footer from '@shared/components/layout/Footer';
import Header from '@shared/components/layout/Header';
import HeroSection from '@shared/components/layout/HeroSection';
import tallerHero from '@assets/images/taller-hero.jpg';

const WorkshopPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          bg="bg-secondary"
          title={'Talleres'}
          image={tallerHero}
          content={`En SOS ofrecemos talleres con herramientas y acompañamiento para
            afrontar la pérdida de una mascota.`}
        />
        <WorkshopListSection />
      </main>
      <Footer />
    </div>
  );
};

export default WorkshopPage;
