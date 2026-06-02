import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ClientsPage } from '@/pages/ClientPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { Outlet } from 'react-router';

/**
 * Route configuration for Client-related pages.
 *
 * This array defines the path and the associated component,
 * wrapped in a security layer to restrict access based on user roles.
 */
const routerAdmin = [
  {
    path: '/clientes',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <Outlet />
      </RoleProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ClientsPage />,
      },
      {
        path: '/recursos',
        element: <ResourcesPage />,
      },
    ],
  },
];

export default routerAdmin;
