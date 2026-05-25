import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ClientsPage } from '@/pages/ClientPage';

/**
 * Route configuration for Client-related pages.
 *
 * This array defines the path and the associated component,
 * wrapped in a security layer to restrict access based on user roles.
 */
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
