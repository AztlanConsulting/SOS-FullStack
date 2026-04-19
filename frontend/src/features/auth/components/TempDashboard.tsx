import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { Text } from '@shared/components/ui/Text';
import { Button } from '@shared/components/ui/Button/Button';
import axios from 'axios';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleTestRequest = async () => {
    try {
      const res = await axios.get('/api/test');
      console.log('Respuesta:', res.data);
      alert('Petición exitosa');
    } catch (err) {
      console.error(err);
      alert('Error en la petición');
    }
  };

  return (
    <div className="min-h-screen color-secondary-bg flex justify-center px-6 py-12">
      <div className="w-full flex justify-center">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-grey-border)]">
            <Text as="h1" variant="h1" weight="medium" className="mb-6">
              Dashboard
            </Text>

            {user && <Text className="mb-6">Bienvenido, {user.email}</Text>}

            <div className="flex flex-col gap-4 max-w-xs">
              <Button
                label="Hacer petición al backend"
                onClick={handleTestRequest}
              />

              <Button
                label="Cerrar sesión"
                variant="secondary"
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
