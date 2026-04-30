import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import IntroPage from '../features/members-only/components/IntroPage';

const MembersOnly = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[72px] lg:pt-0">
        <IntroPage />
      </main>
      <Footer />
    </div>
  );
};

export default MembersOnly;
