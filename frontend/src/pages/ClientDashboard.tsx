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
  { label: 'Mascotas', href: '/inicio/mascotas', icon: <PiDogLight /> },
  { label: 'Blog', href: '/inicio/blog', icon: <TbEdit /> },
  { label: 'Talleres', href: '/inicio/talleres', icon: <LiaToolsSolid /> },
  { label: 'Manuales', href: '/inicio/manuales', icon: <IoBookOutline /> },
];

const ClientDashboard = () => {
  return (
    <>
      <Header
        navLinks={navLinks}
        color={'purple-primary'}
        socialLinks={[]}
        signBtn={SignOut}
      />
      <Outlet />
      <Footer />
    </>
  );
};

export default ClientDashboard;
