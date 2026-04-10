import { MenuIcon } from './icons';

const navLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Servicios', href: '#' },
  { label: 'Planes', href: '#' },
  { label: 'Testimonios', href: '#' },
  { label: 'Contacto', href: '#' },
];

const Header = () => {
  return (
    <header className="bg-white border-b border-light-gray px-4 py-4 lg:py-[17px] w-full">
      <div className="w-full flex items-center justify-between">
        <img src="/1.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12" />

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-medium text-gray hover:text-dark transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button className="lg:hidden p-3 rounded-[228px] hover:bg-light-gray transition-colors">
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
