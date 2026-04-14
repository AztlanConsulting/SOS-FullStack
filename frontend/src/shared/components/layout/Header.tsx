import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Text } from '../ui/Text';
import { LuHouse } from "react-icons/lu";
import { TfiWrite } from "react-icons/tfi";
import { LiaToolsSolid } from "react-icons/lia";
import { IoBookOutline } from "react-icons/io5";
import { PiDogLight } from "react-icons/pi";

const navLinks = [
  { label: 'Inicio', href: '/', icon: <LuHouse /> },
  { label: 'Blog', href: '#', icon: <TfiWrite /> },
  { label: 'Talleres', href: '#',icon: <LiaToolsSolid /> },
  { label: 'Manuales', href: '#', icon: <IoBookOutline  /> },
  { label: 'Mascotas', href: '#',icon: <PiDogLight /> },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-light-gray py-4 lg:py-[17px] w-full relative">
      <div className="fixed right-0 top-2/3 -translate-y-1/2 z-[1000]">
        <div className="w-[30px] h-[104px] color-primary-bg rounded-tl-[8px] rounded-bl-[8px] flex items-center justify-center lg:w-[40px] lg:h-[120px]">
          <span className="text-sm font-medium text-black -rotate-90 whitespace-nowrap tracking-[0.16px]">
            Síguenos
          </span>
        </div>
      </div>
      <div className="w-5/6 mx-auto flex items-center justify-between">
        <img src="/1.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12" />

        <nav className=" hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className=" color-primary-bg hover:text-dark transition-colors"
            >
              <Text variant="body" weight="medium">
                {link.label}
              </Text>
            </a>
          ))}
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
          <div className="w-2/4 max-w-xs color-primary-bg h-full flex flex-col justify-between rounded-l-3xl">
            
            {/* Top */}
            <div className="p-8 border-b border-white/100 flex justify-center">
              <img 
                src="/4.png" 
                alt="Logo" 
                className="w-12 h-12"
              />
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-6 p-6 flex-1">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  <div className="flex gap-2 items-center"> 
                    <Text variant="h2" weight="medium" color="text-white">
                      {link.icon} 
                    </Text>
                    <Text variant="h2" weight="medium" color="text-white">
                      {link.label}
                    </Text>
                  </div>
                </a>
              ))}
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
