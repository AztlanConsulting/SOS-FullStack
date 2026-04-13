import Header from '../shared/components/layout/Header';
import HeroSection from '../features/landing/components/HeroSection';
import ServicesSection from '../features/landing/components/ServicesSection';
import PlansSection from '../features/landing/components/PlansSection';
import PublicationSection from '../features/landing/components/PublicationSection';
import PetInfoSection from '../features/landing/components/PetInfoSection';
import TestimonialsSection from '../features/landing/components/TestimonialsSection';
import Footer from '../shared/components/layout/Footer';
import FrecuentlyAsked from '@features/landing/components/FrecuentlyAsked';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <PlansSection />
        <PublicationSection />
        <TestimonialsSection />
        <PetInfoSection />
        <FrecuentlyAsked />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
