import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import PlansSection from './components/PlansSection';
import PublicationSection from './components/PublicationSection';
import PetInfoSection from './components/PetInfoSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

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
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
