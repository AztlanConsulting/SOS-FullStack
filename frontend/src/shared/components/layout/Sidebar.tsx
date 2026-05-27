import { NavLink } from 'react-router';
import {
  HiUsers,
  HiLink,
  HiBookOpen,
  HiCog,
  HiClipboardList,
} from 'react-icons/hi';
import { HiUserGroup } from 'react-icons/hi';
import { FaDog } from 'react-icons/fa6';
import { TbLogout } from 'react-icons/tb';
import { Text } from '@/shared/components/ui/Text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import SignOut from '@/shared/components/ui/Button/SignOut';
import whiteIcon from '@/assets/images/whiteIcon.webp';

const NAV_ITEMS = [
  { label: 'Clientes', icon: HiUsers, path: '/clientes', enabled: true },
  // { label: 'Mascotas', icon: FaDog, path: '/pets', enabled: false },
  // { label: 'Links', icon: HiLink, path: '/links', enabled: false },
  // { label: 'Colaboradoras', icon: HiUserGroup, path: '/collaborators', enabled: false },
  // { label: 'Blog', icon: HiBookOpen, path: '/blog', enabled: false },
  // { label: 'Recursos', icon: HiCog, path: '/resources', enabled: false },
  // { label: 'Planes', icon: HiClipboardList, path: '/plans', enabled: false },
];

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen w-52 lg:w-64 bg-primary px-4 py-6 shrink-0 sticky top-0 overflow-y-auto sidebar-scrollbar overflow-x-hidden">
        <div className="flex justify-center mb-2">
          <NavLink to="/">
            <img
              src={whiteIcon}
              alt="SOS Logo"
              className="w-24 h-24 object-contain"
            />
          </NavLink>
        </div>
        <div className="w-[calc(100%+2rem)] h-[1.5px] bg-white mb-5 -mx-4" />

        <nav className="flex flex-col gap-3 flex-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path, enabled }) =>
            enabled ? (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-white text-primary rounded-full ml-0 lg:-mr-9 shadow-md z-20'
                      : 'text-white hover:bg-[#EFC137] rounded-full ml-0 lg:-mr-9'
                  }`
                }
              >
                <Icon size={18} />
                <Text variant="body" weight="medium" className="text-inherit">
                  {label}
                </Text>
              </NavLink>
            ) : (
              <div
                key={path}
                className="flex items-center gap-3 px-4 py-3 text-white rounded-full ml-0 lg:-mr-9 opacity-40 pointer-events-none select-none"
              >
                <Icon size={18} />
                <Text variant="body" weight="medium" className="text-inherit">
                  {label}
                </Text>
              </div>
            ),
          )}
        </nav>

        <div className="mt-auto z-10">
          <SignOut.whiteStroke />
        </div>

        <div className="absolute bottom-0 -right-8 max-h-[500px]:hidden [@media(max-height:700px)]:hidden">
          <div className="w-50 h-30 rounded-t-full bg-[#EFC137]" />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary z-50 px-2 py-2">
        <nav className="flex items-center justify-around">
          {NAV_ITEMS.map(({ label, icon: Icon, path, enabled }) =>
            enabled ? (
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
            ) : (
              <div
                key={path}
                className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-white opacity-40 pointer-events-none select-none"
              >
                <Icon size={20} />
                <Text
                  variant="small"
                  weight="medium"
                  className="text-inherit text-[10px]"
                >
                  {label}
                </Text>
              </div>
            ),
          )}
          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors text-white hover:text-gray-200"
          >
            <TbLogout size={20} />
            <Text
              variant="small"
              weight="medium"
              className="text-inherit text-[10px]"
            >
              Salir
            </Text>
          </button>
        </nav>
      </div>

      {/* Mobile bottom padding so content doesn't hide behind nav */}
      <div className="md:hidden h-16" />
    </>
  );
};
