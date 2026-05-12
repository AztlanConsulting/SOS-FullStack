import PetGallery from './PetGallery';
import UploadPet from './UploadPet';
import { type ChangeEvent } from 'react';
import { useSharedGallery } from '../context/PetCollectionProvider';

const SearchPetsPage = () => {
  const { imgHook, pages, handleSearch, vectorImages } = useSharedGallery();
  const [img, setImg] = imgHook;

  async function uploadFile(
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    if (event.target.files && event.target.files[0]) {
      setImg(event.target.files[0]);
    }
  }

  return (
    <div className="flex max-md:flex-col min-h-screen md:pt-0 pt-[80.67px] h-full">
      <UploadPet img={img} uploadFile={uploadFile} />
      <PetGallery
        handleSearch={handleSearch}
        pages={pages}
        vectorImages={vectorImages}
        img={img}
      />
    </div>
  );
};

export default SearchPetsPage;
