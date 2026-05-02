import Footer from '@/shared/components/layout/Footer';
import Header from '@/shared/components/layout/Header';
import { Outlet } from 'react-router';

const PetCollectionPage = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PetCollectionPage;
