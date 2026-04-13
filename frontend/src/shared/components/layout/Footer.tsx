import { Text } from '../ui/Text';
import { FaWhatsapp } from 'react-icons/fa6';
import { CiFacebook } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { PiTiktokLogoLight } from 'react-icons/pi';

const Footer = () => {
  return (
    <footer className="bg-primary-yellow py-8 lg:py-12">
      <div className="w-5/6 mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center gap-6">
            <a href="#" className="text-white hover:opacity-80">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-white hover:opacity-80">
              <CiFacebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-white hover:opacity-80">
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <a href="#" className="text-white hover:opacity-80">
              <PiTiktokLogoLight className="w-6 h-6" />
            </a>
          </div>
          <div className="text-center">
            <Text variant="body" className="underline">
              Términos y Condiciones
            </Text>
          </div>
          <div className="text-center">
            <Text variant="body">
              © {new Date().getFullYear()} Copyright SOS Encontrando Mascotas
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
