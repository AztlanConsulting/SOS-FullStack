// context/PetGalleryContext.tsx
import { createContext, useContext } from 'react';
import usePetGallery from '../hooks/usePetGallery';
import uploadImage from '../services/uploadImage.service';
import countPages from '../services/countPages.service';

const PetGalleryContext = createContext<any>(null);

export const PetGalleryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Move the hook usage here so it stays alive as long as the App is open
  const gallery = usePetGallery(uploadImage, countPages);
  return (
    <PetGalleryContext.Provider value={gallery}>
      {children}
    </PetGalleryContext.Provider>
  );
};

export const useSharedGallery = () => useContext(PetGalleryContext);
