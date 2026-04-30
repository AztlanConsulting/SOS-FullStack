import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import FoundInfo from '@features/found-pet/components/FoundInfo';
import { PetReportForm } from '@features/found-pet/components/PetReportForm';

const CreditsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow pt-18 lg:pt-0">
        <FoundInfo />
        <PetReportForm initialData={{}} />
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;
