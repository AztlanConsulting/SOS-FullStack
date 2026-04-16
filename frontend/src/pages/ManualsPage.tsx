import { Footer } from '@shared/components/layout/Footer';
import { Header } from '@shared/components/layout/Header';
import { ManualsHeroSection } from '@features/manuals/components/ManualsHeroSection';
import { ManualsListSection } from '@features/manuals/components/ManualsListSection';
import { Outlet } from 'react-router';

export const ManualsPage = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="pt-[80.67px] lg:pt-0">
        <ManualsHeroSection />
        <ManualsListSection />
      </main>
      <Footer />
      <Outlet />
    </div>
  );
};
