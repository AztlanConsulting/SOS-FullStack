import SearchFormPage from '@/pages/SearchFormPAge';
import MembersOnly from '../pages/MembersOnly';
import MembersOnlyPage from '../pages/MembersOnlyPage';

const routes = [
  {
    path: '/members-only',
    element: <MembersOnly />,
  },
  {
    path: '/members-only/formulario',
    element: <SearchFormPage />,
  },
  {
    path: '/members-only/page/:id',
    element: <MembersOnlyPage />,
  },
];

export default routes;
