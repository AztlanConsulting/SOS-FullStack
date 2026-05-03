import SearchFormPage from '@/pages/SearchFormPAge';
import MembersOnly from '../pages/MembersOnly';

const routes = [
  {
    path: '/members-only',
    element: <MembersOnly />,
  },
  {
    path: '/members-only/formulario',
    element: <SearchFormPage />,
  },
];

export default routes;
