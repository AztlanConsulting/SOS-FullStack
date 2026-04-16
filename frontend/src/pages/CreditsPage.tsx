import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Credits from '@features/credits/components/Credits';

const CreditsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-[72px] lg:pt-0">
        <Credits />
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;
