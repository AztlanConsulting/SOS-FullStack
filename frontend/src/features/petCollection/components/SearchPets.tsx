import PetGallery from './PetGallery';
import UploadPet from './UploadPet';
import { type ChangeEvent } from 'react';
import uploadImage from '../services/uploadImage.service';
import usePetGallery from '../hooks/usePetGallery';

const SearchPets = () => {
  const { imgHook, pages, handleSearch } = usePetGallery(uploadImage);
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
      <PetGallery handleSearch={handleSearch} pages={pages} />
    </div>
  );
};

export default SearchPets;
