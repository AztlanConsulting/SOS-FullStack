import { Footer } from '@shared/components/layout/Footer';
import { Header } from '@shared/components/layout/Header';
import { ManualsListSection } from '@features/manuals/components/ManualsListSection';
import { Outlet } from 'react-router';
import { ManualsHeroSection } from '@features/manuals/components/ManualsHeroSection';
// import HeroSection from '@shared/components/layout/HeroSection';
// import manualHero from '@/assets/images/manual-hero.jpg';

export const ManualsPage = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="pt-[80.67px] lg:pt-0">
        <ManualsHeroSection />
        {/* <main>
        <HeroSection
          title={'Manuales'}
          image={manualHero}
          content={`Consulta nuestros manuales con información y herramientas útiles
            para el cuidado y protección de mascotas`}
        /> */}
        <ManualsListSection />
      </main>
      <Footer />
      <Outlet />
    </div>
  );
};
