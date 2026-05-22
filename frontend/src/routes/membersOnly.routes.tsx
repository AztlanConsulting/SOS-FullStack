import SearchFormPage from '@/pages/SearchFormPage';
import MembersOnly from '../pages/MembersOnly';
import MembersOnlyPage from '../pages/MembersOnlyPage';
import { Outlet } from 'react-router';

const routes = [
  {
    path: 'contenido-exclusivo',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <MembersOnly />,
      },
      {
        path: 'formulario',
        element: <SearchFormPage />,
      },
      {
        path: 'pagina/:id',
        element: <MembersOnlyPage />,
      },
    ],
  },
];

export default routes;
