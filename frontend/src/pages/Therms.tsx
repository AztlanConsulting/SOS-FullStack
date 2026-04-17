import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import ThermsComp from '@features/landing/components/therms/Therms';
import Conditions from '@features/landing/components/therms/Conditions';

const Therms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-[72px] lg:pt-0">
        <ThermsComp />
        <Conditions />
      </main>
      <Footer />
    </div>
  );
};

export default Therms;
