import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Header from '../shared/components/layout/Header';
import HeroSection from '../features/landing/components/landingPage/HeroSection';
import ServicesSection from '../features/landing/components/landingPage/ServicesSection';
import PlansSection from '../features/landing/components/landingPage/PlansSection';
import PublicationSection from '../features/landing/components/landingPage/PublicationSection';
import PetInfoSection from '../features/landing/components/landingPage/PetInfoSection';
import TestimonialsSection from '../features/landing/components/landingPage/TestimonialsSection';
import Footer from '../shared/components/layout/Footer';
import FrecuentlyAsked from '@features/landing/components/landingPage/FrecuentlyAsked';
import { PetReportForm } from '@features/users/components/PetReportForm';

const LandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollTo = searchParams.get('scrollTo');

  useEffect(() => {
    if (scrollTo === 'report-section') {
      document
        .getElementById('report-section')
        ?.scrollIntoView({ behavior: 'smooth' });
      setSearchParams({}, { replace: true });
    }
  }, [scrollTo]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[72px] lg:pt-0">
        <HeroSection />
        <PublicationSection />
        <PlansSection />
        <ServicesSection />
        <PetReportForm />
        <TestimonialsSection />
        <PetInfoSection />
        <FrecuentlyAsked />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
