import AdminBlogPage from '@/pages/AdminBlogPage';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ClientsPage } from '@/pages/ClientPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { SearchProfilePage } from '@/pages/SearchProfilePage';
import { Outlet } from 'react-router';

/**
 * Route configuration for Client-related pages.
 *
 * This array defines the path and the associated component,
 * wrapped in a security layer to restrict access based on user roles.
 */
const routerAdmin = [
  {
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <Outlet />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: 'clientes',
        element: <ClientsPage />,
      },
      {
        path: 'recursos',
        element: <ResourcesPage />,
      },
      {
        path: 'admin',
        children: [
          {
            path: 'blogs',
            element: <AdminBlogPage />,
          },
          {
            path: 'blogs/:state',
            element: <AdminBlogPage />,
          },
        ],
      },
      {
        path: 'perfil-busqueda',
        element: <SearchProfilePage />,
      },
    ],
  },
];

export default routerAdmin;
