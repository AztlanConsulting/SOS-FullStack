import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ClientsPage } from '@/pages/ClientPage';
//import ClientDetailPage from '@/features/clients/pages/ClientDetailPage';

const routerClients = [
  {
    path: '/clientes',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <ClientsPage />
      </RoleProtectedRoute>
    ),
  },
];

export default routerClients;
