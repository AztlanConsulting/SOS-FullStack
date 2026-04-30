import Footer from '@/shared/components/layout/Footer';
import Header from '@/shared/components/layout/Header';
import { Outlet } from 'react-router';

const ClientDashboard = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default ClientDashboard;
