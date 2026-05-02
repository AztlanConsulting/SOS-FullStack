import PetGallery from './PetGallery';
import UploadPet from './UploadPet';
import { useState, type ChangeEvent } from 'react';
import uploadImage from '../services/uploadImage.service';
import { useQuery } from '@tanstack/react-query';

const SearchPets = () => {
  const [img, setImg] = useState<File | null>(null);
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: [img, page],
    queryFn: () => img && uploadImage(img, page),
    enabled: Boolean(img),
  });

  async function uploadFile(
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    if (event.target.files && event.target.files[0]) {
      setImg(event.target.files[0]);
    }
  }

  return (
    <div className="flex max-md:flex-col min-h-screen md:pt-0 pt-[80.67px]">
      <UploadPet img={img} uploadFile={uploadFile} />
      <PetGallery />
    </div>
  );
};

export default SearchPets;
