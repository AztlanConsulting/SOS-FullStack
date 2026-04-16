import { Text } from '../ui/Text';
import { FaWhatsapp } from 'react-icons/fa6';
import { CiFacebook } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { PiTiktokLogoLight } from 'react-icons/pi';
import { CiYoutube } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="color-primary-bg py-8 lg:py-12">
      <div className="w-5/6 mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/sos_encontrando_mascotas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/SOSencontrandomascotas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <CiFacebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-white hover:opacity-80">
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <a
              href="https://www.tiktok.com/@sos_encontrando_mascotas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <PiTiktokLogoLight className="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCJZ22JJX3yWsozu2y-Quixw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <CiYoutube className="w-6 h-6" />
            </a>
          </div>
          <div className="text-center">
            <Text variant="body" className="underline">
              <a href="/credits">Creditos de imagenes</a>
            </Text>
          </div>
          <div className="text-center">
            <Text variant="body">
              © {new Date().getFullYear()} Copyright SOS Encontrando Mascotas
            </Text>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
