import WorkshopIdPage from '@pages/WorkshopIdPage';
import WorkshopPage from '@pages/WorkshopPage';

const router = [
  {
    path: '/talleres',
    element: <WorkshopPage />,
  },
  {
    path: '/talleres/:id',
    element: <WorkshopIdPage />,
  },
];

export default router;
