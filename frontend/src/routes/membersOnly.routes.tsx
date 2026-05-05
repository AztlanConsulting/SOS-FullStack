import SearchFormPage from '@/pages/SearchFormPage';
import MembersOnly from '../pages/MembersOnly';
import MembersOnlyPage from '../pages/MembersOnlyPage';

const routes = [
  {
    path: '/portal-exclusivo',
    element: <MembersOnly />,
  },
  {
    path: '/portal-exclusivo/formulario',
    element: <SearchFormPage />,
  },
  {
    path: '/portal-exclusivo/page/:id',
    element: <MembersOnlyPage />,
  },
];

export default routes;
