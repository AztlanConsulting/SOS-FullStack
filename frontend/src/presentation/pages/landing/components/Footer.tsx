import { InstagramIcon, FacebookIcon, WhatsAppIcon } from './icons';
import { Text } from '../../../../shared/components/ui/Text';

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
          <div className="text-center">
            <Text variant="body" className="underline">
              Términos y Condiciones
            </Text>
          </div>
          <div className="text-center">
            <Text variant="body">
              © {new Date().getFullYear()} Copywrite SOS Encontrando Mascotas
            </Text>
          </div>

          <div className="text-center">
            <Text variant="body">SOS Encontrando Mascotas</Text>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
