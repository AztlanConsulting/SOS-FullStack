import Header from '../shared/components/layout/Header';
import HeroSection from '../features/landing/components/landingPage/HeroSection';
import ServicesSection from '../features/landing/components/landingPage/ServicesSection';
import PlansSection from '../features/landing/components/landingPage/PlansSection';
import PublicationSection from '../features/landing/components/landingPage/PublicationSection';
import PetInfoSection from '../features/landing/components/landingPage/PetInfoSection';
import TestimonialsSection from '../features/landing/components/landingPage/TestimonialsSection';
import Footer from '../shared/components/layout/Footer';
import FrecuentlyAsked from '@features/landing/components/landingPage/FrecuentlyAsked';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[72px] lg:pt-0">
        <HeroSection />
        <PublicationSection />
        <PlansSection />
        <ServicesSection />
        <TestimonialsSection />
        <PetInfoSection />
        <FrecuentlyAsked />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
