import PetGallery from './PetGallery';
import UploadPet from './UploadPet';
import { type ChangeEvent } from 'react';
import { useSharedGallery } from '../context/PetCollectionProvider';
import HowToUse from './HowToUse';
import convertToWebP from '../services/convertToWebp';

const SearchPets = () => {
  const { imgHook, pages, handleSearch, vectorImages } = useSharedGallery();
  const [img, setImg] = imgHook;

  async function uploadFile(
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    if (
      event.target.files &&
      event.target.files[0] &&
      event.target.files[0].size <= 5000000
    ) {
      console.log(event.target.files[0].size);
      const compressed = await convertToWebP(event.target.files[0]);
      console.log(compressed.size);
      setImg(compressed);
      return true;
    }
    return false;
  }

  return (
    <div className="min-h-screen md:pt-0 pt-[80.67px] h-full">
      <HowToUse />
      <div className="flex max-md:flex-col">
        <UploadPet img={img} uploadFile={uploadFile} />
        <PetGallery
          handleSearch={handleSearch}
          pages={pages}
          vectorImages={vectorImages}
          img={img}
        />
      </div>
    </div>
  );
};

export default SearchPets;
