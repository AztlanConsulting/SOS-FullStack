import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@features/auth/hooks/useAuth';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Text } from '../ui/Text';
import { LuHouse } from 'react-icons/lu';
import { TfiWrite } from 'react-icons/tfi';
import { LiaToolsSolid } from 'react-icons/lia';
import { IoBookOutline } from 'react-icons/io5';
import { PiDogLight } from 'react-icons/pi';
import { CiFacebook } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { PiTiktokLogoLight } from 'react-icons/pi';
import { CiYoutube } from 'react-icons/ci';
import { FaXTwitter } from 'react-icons/fa6';
import yellowIcon from '@assets/images/yellowIcon.png';
import whiteIcon from '@assets/images/whiteIcon.png';
import type { NavLink, SocialLink } from '@/shared/types/header.types';
import SignIn from '../ui/Button/SignIn';

const defaultNavLinks = [
  { label: 'Inicio', href: '/', icon: <LuHouse /> },
  { label: 'Blog', href: '/blog', icon: <TfiWrite /> },
  { label: 'Talleres', href: '/talleres', icon: <LiaToolsSolid /> },
  { label: 'Manuales', href: '/manuales', icon: <IoBookOutline /> },
  { label: 'Mascotas', href: '#', icon: <PiDogLight /> },
];

export const defaultSocialLinks = [
  {
    href: 'https://www.instagram.com/sos_encontrando_mascotas/',
    icon: <FaInstagram className="w-5 h-5" />,
  },
  {
    href: 'https://www.facebook.com/SOSencontrandomascotas',
    icon: <CiFacebook className="w-5 h-5" />,
  },
  {
    href: 'https://www.tiktok.com/@sos_encontrando_mascotas',
    icon: <PiTiktokLogoLight className="w-5 h-5" />,
  },
  {
    href: 'https://www.youtube.com/channel/UCJZ22JJX3yWsozu2y-Quixw',
    icon: <CiYoutube className="w-5 h-5" />,
  },
  {
    href: 'https://x.com/EncontrandoSos',
    icon: <FaXTwitter className="w-5 h-5" />,
  },
];

interface Props {
  navLinks: NavLink[];
  socialLinks?: SocialLink[];
  color?: string;
  signBtn?: {
    desktop: () => React.ReactNode;
    mobile: (setIsMenuOpen: (b: boolean) => void) => React.ReactNode;
  };
}

const Header = ({
  navLinks = defaultNavLinks,
  socialLinks = defaultSocialLinks,
  color = 'primary',
  signBtn = SignIn,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const firstName = user?.username.trim().split(/\s+/)[0] ?? '';

  return (
    <header className="bg-white border-b border-[color:var(--color-grey-border)] py-4 lg:py-2 w-full fixed lg:static top-0 left-0 right-0 z-50 lg:pt-16">
      {!isMenuOpen && (
        <>
          {isSocialOpen ? (
            <div
              className="fixed right-0 z-[1000] mb-0"
              style={{
                bottom: 'calc(104px + 80px)',
              }}
            >
              <div className="flex flex-col">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[30px] h-[60px] bg-white border-2 border-[#f9cd48] rounded-tl-[8px] rounded-bl-[8px] flex items-center justify-center hover:opacity-80 cursor-pointer"
                  >
                    <span className="text-black -rotate-90">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {socialLinks.length > 0 && (
            <div
              className="fixed right-0 z-[1000] shadow-xl rounded-lg"
              style={{ bottom: '80px' }}
            >
              <div className="w-[30px] h-[104px] color-primary-bg rounded-tl-[8px] rounded-bl-[8px] flex flex-col items-center justify-center gap-2 ">
                <button
                  onClick={() => setIsSocialOpen((prev) => !prev)}
                  className="w-[24px] h-[24px] color-primary-bg rounded-[4px] flex items-center justify-center cursor-pointer"
                >
                  <span className="text-xs font-medium text-black -rotate-90 whitespace-nowrap">
                    {isSocialOpen ? 'Cerrar' : 'Síguenos'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <div className="pl-8 pr-3 lg:w-5/6 mx-auto flex items-center justify-between">
        <img
          src={yellowIcon}
          alt="Logo"
          className="w-12 h-12 lg:hidden cursor-pointer"
          onClick={() => navigate('/')}
        />

        <nav className="hidden lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:flex items-center justify-between px-12 lg:px-8 z-40 bg-white py-2 border-b border-[color:var(--color-grey-border)]">
          <img
            src={yellowIcon}
            alt="Logo"
            className="w-12 h-12 lg:w-14 lg:h-14 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.label}
                  onClick={() => navigate(link.href)}
                  className={`transition-colors cursor-pointer  ${
                    isActive ? `border-b-2 border-${color}` : ''
                  }`}
                >
                  <Text
                    variant="body"
                    weight="medium"
                    className={`hover:text-${color}`}
                  >
                    {link.label}
                  </Text>
                </div>
              );
            })}
            {signBtn.desktop()}
          </div>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-3 rounded-[228px] hover:bg-light-gray transition-colors text-black"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className={`w-2/3 max-w-xs bg-${color} h-full flex flex-col justify-between`}
          >
            {/* Top */}
            <div className="p-8 border-b border-white flex justify-center">
              <img
                src={whiteIcon}
                alt="Logo"
                className="w-14 h-14 cursor-pointer"
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
              />
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-6 py-6 pl-4 flex-1 pr-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <div
                    key={link.label}
                    onClick={() => {
                      navigate(link.href);
                      setIsMenuOpen(false);
                    }}
                    className={`flex gap-4 items-center py-3 pl-4 transition-all cursor-pointer ${
                      isActive ? 'bg-white rounded-l-[40px] shadow-lg' : ''
                    }`}
                  >
                    <div className="flex gap-4 items-center box-shad">
                      <span
                        className={
                          isActive
                            ? `text-${color} text-2xl`
                            : 'text-white text-2xl'
                        }
                      >
                        {link.icon}
                      </span>
                      <Text
                        variant="h3"
                        weight="medium"
                        color={isActive ? `text-${color}` : 'text-white'}
                      >
                        {link.label}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Bottom button */}
            {signBtn.mobile(setIsMenuOpen)}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
