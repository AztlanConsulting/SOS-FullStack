import Footer from '@/shared/components/layout/Footer';
import Header from '@/shared/components/layout/Header';
import SignOut from '@/shared/components/ui/Button/SignOut';
import { Outlet } from 'react-router';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { HiMiniRectangleStack } from 'react-icons/hi2';
import { PiDogLight } from 'react-icons/pi';

const navLinks = [
  { label: 'Portal exclusivo', href: '/inicio', icon: <HiOutlineUserCircle /> },
  {
    label: 'Contenido exclusivo',
    href: '/inicio/contenido-exclusivo',
    icon: <HiMiniRectangleStack />,
  },
  {
    label: 'Radar de coincidencias',
    href: '/inicio/radar-de-coincidencias',
    icon: <PiDogLight />,
  },
];

const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navLinks={navLinks}
        color={'purple-primary'}
        socialLinks={[]}
        signBtn={SignOut}
      />
      <Outlet />
      <Footer bg={'bg-purple-primary'} />
    </div>
  );
};

export default ClientDashboard;
