import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';
import { Text } from '../ui/Text';

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Talleres', to: '/talleres' },
  { label: 'Manuales', to: '/manuales' },
  { label: 'Mascotas', to: '/mascotas' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-light-gray px-4 py-4 lg:py-[17px] w-full relative">
      <div className="w-full flex items-center justify-between">
        <img src="/1.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12" />

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="hover:text-dark transition-colors"
            >
              <Text variant="body" weight="medium">
                {link.label}
              </Text>
            </Link>
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
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-dark transition-colors"
              >
                <Text variant="body" weight="medium">
                  {link.label}
                </Text>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
