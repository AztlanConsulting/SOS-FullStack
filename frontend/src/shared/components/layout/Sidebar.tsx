import { NavLink } from 'react-router-dom';
import {
  HiUsers,
  HiLink,
  HiBookOpen,
  HiCog,
  HiClipboardList,
} from 'react-icons/hi';
import { HiUserGroup } from 'react-icons/hi';
import { FaDog } from 'react-icons/fa6';
import { Text } from '@/shared/components/ui/Text';
import whiteIcon from '@/assets/images/whiteIcon.png';

const NAV_ITEMS = [
  { label: 'Clientes', icon: HiUsers, path: '/clientes' },
  { label: 'Mascotas', icon: FaDog, path: '/pets' },
  { label: 'Links', icon: HiLink, path: '/links' },
  { label: 'Colaboradoras', icon: HiUserGroup, path: '/collaborators' },
  { label: 'Blog', icon: HiBookOpen, path: '/blog' },
  { label: 'Recursos', icon: HiCog, path: '/resources' },
  { label: 'Planes', icon: HiClipboardList, path: '/plans' },
];

export const Sidebar = () => {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen w-64 bg-primary px-4 py-6 shrink-0 sticky top-0 overflow-hidden">
        <div className="flex justify-center mb-2">
          <img
            src={whiteIcon}
            alt="SOS Logo"
            className="w-30 h-30 object-contain"
          />
        </div>
        <div className="w-[calc(100%+2rem)] h-[1.5px] bg-white mb-5 -mx-4" />

        <nav className="flex flex-col gap-3">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-white text-primary rounded-full ml-0 -mr-9 shadow-md'
                    : 'text-white hover:bg-[#EFC137] rounded-full ml-0 -mr-9'
                }`
              }
            >
              <Icon size={18} />
              <Text variant="body" weight="medium" className="text-inherit">
                {label}
              </Text>
            </NavLink>
          ))}
        </nav>

        <div className="absolute -bottom-20 -right-8">
          <div className="w-50 h-50 rounded-full bg-[#EFC137]" />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary z-50 px-2 py-2">
        <nav className="flex items-center justify-around">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors ${
                  isActive ? 'bg-white text-primary' : 'text-white'
                }`
              }
            >
              <Icon size={20} />
              <Text
                variant="small"
                weight="medium"
                className="text-inherit text-[10px]"
              >
                {label}
              </Text>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile bottom padding so content doesn't hide behind nav */}
      <div className="md:hidden h-16" />
    </>
  );
};
