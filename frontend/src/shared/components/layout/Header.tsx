import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Text } from '../ui/Text';
import { LuHouse } from 'react-icons/lu';
import { TfiWrite } from 'react-icons/tfi';
import { LiaToolsSolid } from 'react-icons/lia';
import { IoBookOutline } from 'react-icons/io5';
import { PiDogLight } from 'react-icons/pi';
import { FaWhatsapp } from 'react-icons/fa6';
import { CiFacebook } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { PiTiktokLogoLight } from 'react-icons/pi';
import { CiYoutube } from 'react-icons/ci';
import { FaXTwitter } from 'react-icons/fa6';

const navLinks = [
  { label: 'Inicio', href: '/', icon: <LuHouse /> },
  { label: 'Blog', href: '#', icon: <TfiWrite /> },
  { label: 'Talleres', href: '#', icon: <LiaToolsSolid /> },
  { label: 'Manuales', href: '#', icon: <IoBookOutline /> },
  { label: 'Mascotas', href: '#', icon: <PiDogLight /> },
];

export const socialLinks = [
  {
    href: 'https://www.instagram.com/sos_encontrando_mascotas/',
    icon: <FaInstagram className="w-5 h-5" />,
  },
  {
    href: 'https://www.facebook.com/SOSencontrandomascotas',
    icon: <CiFacebook className="w-5 h-5" />,
  },
  { href: '#', icon: <FaWhatsapp className="w-5 h-5" /> },
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-(--color-grey-border) py-4 lg:py-[17px] w-full fixed top-0 left-0 right-0 z-50 lg:relative">
      {!isMenuOpen && (
        <>
          {isSocialOpen ? (
            <div
              className="fixed right-0 -translate-y-1/2 z-[1000]"
              style={{
                top: 'calc(60% - 231px)',
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
          <div className="fixed right-0 top-[60%] -translate-y-1/2 z-[1000]">
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
        </>
      )}
      <div className="w-5/6 mx-auto flex items-center justify-between">
        <img src="/1.png" alt="Logo" className="w-12 h-12 lg:w-14 lg:h-14" />

        <nav className=" hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div
                key={link.label}
                onClick={() => navigate(link.href)}
                className={`hover:text-dark transition-colors cursor-pointer ${
                  isActive ? 'text-dark border-b-2 border-primary-bg' : ''
                }`}
              >
                <Text variant="body" weight="medium">
                  {link.label}
                </Text>
              </div>
            );
          })}
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
          <div className="w-2/3 max-w-xs color-primary-bg h-full flex flex-col justify-between">
            {/* Top */}
            <div className="p-8 border-b border-white/100 flex justify-center">
              <img src="/4.png" alt="Logo" className="w-14 h-14" />
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-6 p-6 flex-1 pr-0">
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
                      isActive ? 'bg-white rounded-l-[20px] shadow' : ''
                    }`}
                  >
                    <div className="flex gap-4 items-center box-shad">
                      <span
                        className={
                          isActive
                            ? 'text-yellow-400 text-2xl'
                            : 'text-white text-2xl'
                        }
                      >
                        {link.icon}
                      </span>
                      <Text
                        variant="h2"
                        weight="medium"
                        color={isActive ? 'text-yellow-400' : 'text-white'}
                      >
                        {link.label}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Bottom button */}
            <div className="p-8 border-t border-white/100">
              <button className="w-full">
                <Text variant="h3" weight="bold" color="text-white">
                  Iniciar Sesión
                </Text>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;