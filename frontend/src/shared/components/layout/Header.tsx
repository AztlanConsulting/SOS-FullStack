import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Text } from '../ui/Text';
import { LuHouse } from 'react-icons/lu';
import { TfiWrite } from 'react-icons/tfi';
import { LiaToolsSolid } from 'react-icons/lia';
import { IoBookOutline } from 'react-icons/io5';
import { PiDogLight } from 'react-icons/pi';
import { CiFacebook } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { PiTiktokLogoLight } from 'react-icons/pi';
import { CiYoutube } from 'react-icons/ci';
import { FaXTwitter } from 'react-icons/fa6';
import yellowIcon from '@assets/images/yellowIcon.png';
import whiteIcon from '@assets/images/whiteIcon.png';
import type {
  ExpandedProps,
  NavLink,
  SocialLink,
} from '@/shared/types/header.types';
import SignIn from '../ui/Button/SignIn';

const defaultNavLinks = [
  { label: 'Inicio', href: '/', icon: <LuHouse /> },
  {
    label: 'Registrar',
    icon: <PiDogLight />,
    children: [
      { label: 'Perdí mi mascota', href: '/#report-section' },
      { label: 'Encontré una mascota', href: '/mascotas-encontradas' },
    ],
  },
  { label: 'Blog', href: '/blog', icon: <TfiWrite /> },
  { label: 'Talleres', href: '/talleres', icon: <LiaToolsSolid /> },
  { label: 'Manuales', href: '/manuales', icon: <IoBookOutline /> },
];

export const defaultSocialLinks = [
  {
    href: 'https://www.instagram.com/sos_encontrando_mascotas/',
    icon: <FaInstagram className="w-5 h-5" />,
  },
  {
    href: 'https://www.facebook.com/SOSencontrandomascotas',
    icon: <CiFacebook className="w-5 h-5" />,
  },
  {
    href: 'https://www.tiktok.com/@sos_encontrando_mascotas',
    icon: <PiTiktokLogoLight className="w-5 h-5" />,
  },
  {
    href: 'https://www.youtube.com/channel/UCJZ22JJX3yWsozu2y-Quixw',
    icon: <CiYoutube className="w-5 h-5" />,
  },
  {
    href: 'https://x.com/EncontrandoSos',
    icon: <FaXTwitter className="w-5 h-5" />,
  },
];

interface Props {
  navLinks?: NavLink[];
  socialLinks?: SocialLink[];
  color?: string;
  signBtn?: {
    desktop: () => React.ReactNode;
    mobile: ({ setIsMenuOpen }: ExpandedProps) => React.ReactNode;
  };
}

const Header = ({
  navLinks = defaultNavLinks,
  socialLinks = defaultSocialLinks,
  color = 'primary',
  signBtn = SignIn,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);
  const navigate = useNavigate();
  const MobileSignIn = signBtn.mobile;

  const handleHashNav = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const targetPath = path || '/';
      if (pathname === targetPath) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`${targetPath}?scrollTo=${hash}`);
      }
    } else {
      window.scrollTo(0, 0);
      navigate(href);
    }
  };

  const textColors: Record<string, string> = {
    primary: 'text-primary',
    'purple-primary': 'text-purple-primary',
  };

  const bgColors: Record<string, string> = {
    primary: 'bg-primary',
    'purple-primary': 'bg-purple-primary',
  };

  const borderColors: Record<string, string> = {
    primary: 'border-primary',
    'purple-primary': 'border-purple-primary',
  };

  return (
    <header className="bg-white border-b border-[color:var(--color-grey-border)] py-4 lg:py-2 w-full fixed lg:static top-0 left-0 right-0 z-50 lg:pt-16">
      {!isMenuOpen && (
        <>
          {isSocialOpen ? (
            <div
              className="fixed right-0 z-[1000] mb-0"
              style={{
                bottom: 'calc(104px + 80px)',
              }}
            >
              <div className="flex flex-col">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[30px] h-[60px] bg-white border-2 border-[#f9cd48] rounded-tl-[8px] rounded-bl-[8px] flex items-center justify-center hover:opacity-80 cursor-pointer"
                  >
                    <span className="text-black -rotate-90">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {socialLinks.length > 0 && (
            <div
              className="fixed right-0 z-[1000] shadow-xl rounded-lg"
              style={{ bottom: '80px' }}
            >
              <div className="w-[30px] h-[104px] color-primary-bg rounded-tl-[8px] rounded-bl-[8px] flex flex-col items-center justify-center gap-2 ">
                <button
                  onClick={() => setIsSocialOpen((prev) => !prev)}
                  className="w-[24px] h-[24px] color-primary-bg rounded-[4px] flex items-center justify-center cursor-pointer"
                >
                  <span className="text-xs font-medium text-black -rotate-90 whitespace-nowrap">
                    {isSocialOpen ? 'Cerrar' : 'Síguenos'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <div className="pl-8 pr-3 lg:w-5/6 mx-auto flex items-center justify-between">
        <img
          src={yellowIcon}
          alt="Logo"
          className="w-12 h-12 lg:hidden cursor-pointer"
          onClick={() => {
            window.scrollTo(0, 0);
            navigate('/');
          }}
        />

        <nav className="hidden lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:flex items-center justify-between px-12 lg:px-8 z-40 bg-white py-2 border-b border-[color:var(--color-grey-border)]">
          <img
            src={yellowIcon}
            alt="Logo"
            className="w-12 h-12 lg:w-14 lg:h-14 cursor-pointer"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/');
            }}
          />
          <div ref={dropdownRef} className="flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.children) {
                const isActive = link.children.some(
                  (child) => pathname === child.href,
                );
                return (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === link.label ? null : link.label,
                        )
                      }
                      className={`flex items-center gap-1 transition-colors cursor-pointer py-2 ${
                        isActive ? `border-b-2 ${borderColors[color]}` : ''
                      }`}
                    >
                      <Text
                        variant="body"
                        weight="medium"
                        className={`hover:${textColors[color]}`}
                      >
                        {link.label}
                      </Text>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === link.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-3 bg-white border border-[color:var(--color-grey-border)] rounded-lg shadow-lg py-1 min-w-[220px] z-50">
                        {link.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => {
                              handleHashNav(child.href);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Text variant="body" weight="regular">
                              {child.label}
                            </Text>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.label}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(link.href!);
                  }}
                  className={`transition-colors cursor-pointer  ${
                    isActive ? `border-b-2 ${borderColors[color]}` : ''
                  }`}
                >
                  <Text
                    variant="body"
                    weight="medium"
                    className={`hover:${textColors[color]}`}
                  >
                    {link.label}
                  </Text>
                </div>
              );
            })}
            {signBtn.desktop()}
          </div>
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
          <div
            className={`w-2/3 max-w-xs ${bgColors[color]} h-full flex flex-col justify-between`}
          >
            {/* Top */}
            <div className="p-8 border-b border-white flex justify-center">
              <img
                src={whiteIcon}
                alt="Logo"
                className="w-14 h-14 cursor-pointer"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate('/');
                  setIsMenuOpen(false);
                }}
              />
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-2 py-6 flex-1 pr-0">
              {navLinks.map((link) => {
                if (link.children) {
                  const isExpanded = openDropdown === link.label;
                  return (
                    <div key={link.label}>
                      <div
                        onClick={() =>
                          setOpenDropdown(isExpanded ? null : link.label)
                        }
                        className="flex gap-4 items-center py-5 px-6 transition-all cursor-pointer justify-between"
                      >
                        <div className="flex gap-4 items-center">
                          <span className="text-white text-2xl">
                            {link.icon}
                          </span>
                          <Text variant="h3" weight="medium" color="text-white">
                            {link.label}
                          </Text>
                        </div>
                        <svg
                          className={`w-5 h-5 text-white transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      {isExpanded && (
                        <div>
                          {link.children.map((child) => {
                            const childIsActive = pathname === child.href;
                            return (
                              <div
                                key={child.label}
                                onClick={() => {
                                  handleHashNav(child.href);
                                  setIsMenuOpen(false);
                                  setOpenDropdown(null);
                                }}
                                className={`flex gap-4 items-center py-5 pl-16 pr-3 transition-all cursor-pointer ${
                                  childIsActive ? 'bg-[#FAD25A]' : ''
                                }`}
                              >
                                <Text
                                  variant="body"
                                  weight="regular"
                                  color="text-white/80"
                                >
                                  {child.label}
                                </Text>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                const isActive = pathname === link.href;
                return (
                  <div
                    key={link.label}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(link.href!);
                      setIsMenuOpen(false);
                    }}
                    className={`flex gap-4 items-center py-5 pl-6 transition-all cursor-pointer ${
                      isActive ? 'bg-[#FAD25A]' : ''
                    }`}
                  >
                    <div className="flex gap-4 items-center box-shad">
                      <span className="text-white text-2xl">{link.icon}</span>
                      <Text variant="h3" weight="medium" color="text-white">
                        {link.label}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Bottom button */}
            {<MobileSignIn setIsMenuOpen={setIsMenuOpen} />}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
