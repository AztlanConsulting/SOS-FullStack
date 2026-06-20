import { NavLink, useNavigate } from 'react-router';
import { HiUsers, HiCog, HiBookOpen, HiCollection } from 'react-icons/hi';
import { TbLogout } from 'react-icons/tb';
import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import SignOut from '@/shared/components/ui/Button/SignOut';
import { DecisionModal } from '@/shared/components/ui/Modal/DecisionModal';
import whiteIcon from '@/assets/images/whiteIcon.webp';

const NAV_ITEMS = [
  { label: 'Clientes', icon: HiUsers, path: '/clientes', enabled: true },
  // { label: 'Mascotas', icon: FaDog, path: '/pets', enabled: false },
  // { label: 'Links', icon: HiLink, path: '/links', enabled: false },
  // { label: 'Colaboradoras', icon: HiUserGroup, path: '/collaborators', enabled: false },
  { label: 'Blog', icon: HiBookOpen, path: '/admin/blogs', enabled: true },
  { label: 'Recursos', icon: HiCollection, path: '/recursos', enabled: true },
  // { label: 'Planes', icon: HiClipboardList, path: '/plans', enabled: false },
];

export const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-screen w-52 lg:w-64 bg-primary px-4 py-6 shrink-0 fixed top-0 left-0 overflow-x-hidden">
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary z-50 px-2 py-2 w-full overflow-hidden">
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
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors text-white hover:text-gray-200"
          >
            <TbLogout size={20} />
            <Text
              variant="small"
              weight="medium"
              className="text-inherit text-[10px]"
            >
              Cerrar sesión
            </Text>
          </button>
        </nav>
      </div>

      {isLogoutModalOpen && (
        <DecisionModal
          title="¿Deseas cerrar sesión?"
          description="Tu sesión se cerrará y tendrás que volver a iniciar sesión para continuar."
          color="yellow"
          onClose={() => setIsLogoutModalOpen(false)}
          leftText="Cancelar"
          rightText="Cerrar sesión"
          onLeftAction={() => setIsLogoutModalOpen(false)}
          onRightAction={() => {
            logout();
            navigate('/');
            setIsLogoutModalOpen(false);
          }}
        />
      )}

      {/* Mobile bottom padding so content doesn't hide behind nav */}
      <div className="lg:hidden h-16" />
    </>
  );
};
