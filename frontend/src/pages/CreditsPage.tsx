import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Credits from '@features/credits/components/Credits';
import CreditsInfo from '@features/credits/components/CreditsInfo';


const CreditsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-[72px] lg:pt-0">
        <CreditsInfo /> 
        <Credits />
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;
