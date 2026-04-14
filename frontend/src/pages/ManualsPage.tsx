import { Footer } from '@shared/components/layout/Footer';
import { Header } from '@shared/components/layout/Header';
import { ManualsHeroSection } from '@features/manuals/components/ManualsHeroSection';
import { ManualsListSection } from '@features/manuals/components/ManualsListSection';

export const ManualsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ManualsHeroSection />
        <ManualsListSection />
      </main>
      <Footer />
    </div>
  );
};
