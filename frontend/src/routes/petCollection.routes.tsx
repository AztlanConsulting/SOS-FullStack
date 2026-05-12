import PetDetails from '@/features/petCollection/components/PetDetails';
import SearchPets from '@/features/petCollection/components/SearchPetsPage';
import { PetGalleryProvider } from '@/features/petCollection/context/PetCollectionProvider';
import PetCollectionPage from '@/pages/PetCollectionPage';

const router = [
  {
    path: 'coleccion-mascotas',
    element: (
      <PetGalleryProvider>
        <PetCollectionPage />
      </PetGalleryProvider>
    ),
    children: [
      {
        index: true,
        element: <SearchPets />,
      },
      {
        path: ':id',
        element: <PetDetails />,
      },
    ],
  },
];

export default router;
