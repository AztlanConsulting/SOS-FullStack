import { lazy, Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Header from '../shared/components/layout/Header';
import HeroSection from '../features/landing/components/landingPage/HeroSection';
import { PetReportForm } from '@features/users/components/PetReportForm';

const ServicesSection = lazy(
  () => import('../features/landing/components/landingPage/ServicesSection'),
);
const PlansSection = lazy(
  () => import('../features/landing/components/landingPage/PlansSection'),
);
const PublicationSection = lazy(
  () => import('../features/landing/components/landingPage/PublicationSection'),
);
const PetInfoSection = lazy(
  () => import('../features/landing/components/landingPage/PetInfoSection'),
);
const TestimonialsSection = lazy(
  () =>
    import('../features/landing/components/landingPage/TestimonialsSection'),
);
const Footer = lazy(() => import('../shared/components/layout/Footer'));
const FrecuentlyAsked = lazy(
  () => import('@features/landing/components/landingPage/FrecuentlyAsked'),
);

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
        <Suspense fallback={<>Cargando...</>}>
          <PublicationSection />
          <PlansSection />
          <ServicesSection />
          <PetInfoSection />
          <PetReportForm />
          <TestimonialsSection />
          <FrecuentlyAsked />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
