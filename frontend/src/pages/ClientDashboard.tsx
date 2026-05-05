import Footer from '@/shared/components/layout/Footer';
import Header from '@/shared/components/layout/Header';
import SignOut from '@/shared/components/ui/Button/SignOut';
import { Outlet } from 'react-router';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { LiaToolsSolid } from 'react-icons/lia';
import { IoBookOutline } from 'react-icons/io5';
import { PiDogLight } from 'react-icons/pi';
import { TbEdit } from 'react-icons/tb';

const navLinks = [
  { label: 'Inicio', href: '/inicio', icon: <HiOutlineUserCircle /> },
  { label: 'Mascotas', href: '/mascotas-encontradas', icon: <PiDogLight /> },
  { label: 'Blog', href: '/blog', icon: <TbEdit /> },
  { label: 'Talleres', href: '/talleres', icon: <LiaToolsSolid /> },
  { label: 'Manuales', href: '/manuales', icon: <IoBookOutline /> },
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
      <div className="flex-grow">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
