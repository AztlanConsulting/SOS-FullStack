import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Text } from '../../../../shared/components/ui/Text';

const navLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Servicios', href: '#' },
  { label: 'Planes', href: '#' },
  { label: 'Testimonios', href: '#' },
  { label: 'Contacto', href: '#' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-light-gray px-4 py-4 lg:py-[17px] w-full relative">
      <div className="w-full flex items-center justify-between">
        <img src="/1.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12" />

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-dark transition-colors"
            >
              <Text variant="body" weight="medium">
                {link.label}
              </Text>
            </a>
          ))}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-3 rounded-[228px] hover:bg-light-gray transition-colors text-dark"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-light-gray z-50">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-dark transition-colors"
              >
                <Text variant="body" weight="medium">
                  {link.label}
                </Text>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
