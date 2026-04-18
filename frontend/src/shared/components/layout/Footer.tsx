import { Text } from '../ui/Text';
import { CiFacebook } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { PiTiktokLogoLight } from 'react-icons/pi';
import { CiYoutube } from 'react-icons/ci';
import { FaXTwitter } from 'react-icons/fa6';

export const Footer = () => {
  return (
    <footer className="color-primary-bg py-8 lg:py-12">
      <div className="w-5/6 mx-auto">
        <div className="flex flex-col items-center  gap-5">
          <div className="flex justify-center gap-8 mb-5">
            <a
              href="https://www.instagram.com/sos_encontrando_mascotas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <FaInstagram className="w-6 h-6 lg:w-8 lg:h-8" />
            </a>
            <a
              href="https://www.facebook.com/SOSencontrandomascotas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <CiFacebook className="w-6 h-6 lg:w-10 lg:h-10" />
            </a>
            <a
              href="https://www.tiktok.com/@sos_encontrando_mascotas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <PiTiktokLogoLight className="w-6 h-6 lg:w-10 lg:h-10" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCJZ22JJX3yWsozu2y-Quixw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <CiYoutube className="w-6 h-6 lg:w-8 lg:h-8" />
            </a>
            <a
              href="https://x.com/EncontrandoSos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <FaXTwitter className="w-6 h-6 lg:w-8 lg:h-8" />
            </a>
          </div>
          <div className="text-center">
            <Text variant="body" className="underline">
              <a href="/therms">Terminos y condiciones</a>
            </Text>
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
          <div className="text-center">
            <Text variant="body">SOS Encontrando Mascotas</Text>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
