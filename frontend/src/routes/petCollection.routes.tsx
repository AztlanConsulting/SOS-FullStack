import PetDetails from '@/features/petCollection/components/PetDetails';
import SearchPets from '@/features/petCollection/components/SearchPets';
import PetCollectionPage from '@/pages/PetCollectionPage';

const router = [
  {
    path: '/coleccion-mascotas',
    element: <PetCollectionPage />,
    children: [
      {
        index: true,
        element: <SearchPets />,
      },
      {
        path: 'detalles/:id',
        element: <PetDetails />,
      },
    ],
  },
];

export default router;
