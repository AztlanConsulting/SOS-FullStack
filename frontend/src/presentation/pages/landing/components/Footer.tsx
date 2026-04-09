import { ChevronRight } from './icons';

const Footer = () => {
  return (
    <footer className="bg-primary-yellow py-8 lg:py-12">
      <div className="w-full px-4">
        <p className="text-center text-base text-dark font-normal">
          © {new Date().getFullYear()} SOS Encontrando Mascotas. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
