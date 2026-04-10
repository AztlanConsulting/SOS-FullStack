import { InstagramIcon, FacebookIcon, WhatsAppIcon } from './icons';

const Footer = () => {
  return (
    <footer className="bg-primary-yellow py-8 lg:py-12">
      <div className="w-full px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center gap-6">
            <a href="#" className="text-white hover:opacity-80">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="#" className="text-white hover:opacity-80">
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a href="#" className="text-white hover:opacity-80">
              <WhatsAppIcon className="w-6 h-6" />
            </a>
          </div>
          <p className="text-center text-base text-dark font-normal underline">
            Términos y Condiciones
          </p>
          <p className="text-center text-base text-dark font-normal">
            © {new Date().getFullYear()} Copywrite SOS Encontrando Mascotas
          </p>

          <p className="text-center text-base text-dark font-normal">
            SOS Encontrando Mascotas
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
