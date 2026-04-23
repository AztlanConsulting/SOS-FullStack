import type { PetReportData } from '../types/PetReportData.types';
import { Text } from '@shared/components/ui/Text/Text';
import whiteLogoSimple from '@assets/images/whiteLogoSimple.png';
import phone from '@assets/images/phone.png';

export const poster = ({ pet }: { pet: PetReportData }) => {
  const renderImages = () => {
    switch (pet.imageLayout) {
      case '1':
        return (
          <div className="w-[850px] h-[550px]">
            <img
              src={URL.createObjectURL(pet.images[0])}
              className="w-[850px] h-[550px] object-cover"
            />
          </div>
        );

      case '2':
        return (
          <div className="grid grid-cols-2 w-[850px] h-[550px]">
            <img
              src={URL.createObjectURL(pet.images[0])}
              className="w-[425px] h-[550px] object-cover rounded-lg"
            />
            <img
              src={URL.createObjectURL(pet.images[1])}
              className="w-[425px] h-[550px] object-cover rounded-lg"
            />
          </div>
        );

      case '3':
        return (
          <div className="grid grid-cols-2 w-[850px] h-[550px]">
            <img
              src={URL.createObjectURL(pet.images[0])}
              className="w-[425px] h-[275px] object-cover rounded-lg"
            />
            <img
              src={URL.createObjectURL(pet.images[1])}
              className="w-[425px] h-[275px] object-cover rounded-lg"
            />
            <img
              src={URL.createObjectURL(pet.images[2])}
              className="w-[425px] h-[550px] object-cover rounded-lg row-span-2"
            />
          </div>
        );

      case '4':
        return (
          <div className="grid grid-cols-2 grid-rows-2 w-[850px] h-[550px]">
            <img
              src={URL.createObjectURL(pet.images[0])}
              className="w-[425px] h-[275px] object-cover rounded-lg"
            />
            <img
              src={URL.createObjectURL(pet.images[1])}
              className="w-[425px] h-[275px] object-cover rounded-lg"
            />
            <img
              src={URL.createObjectURL(pet.images[2])}
              className="w-[425px] h-[275px] object-cover rounded-lg"
            />
            <img
              src={URL.createObjectURL(pet.images[3])}
              className="w-[425px] h-[275px] object-cover rounded-lg"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="poster" className="w-[1080px] h-[1350px] flex flex-col">
      <div className="color-primary-bg h-[104px] w-[1080px] flex items-center justify-evenly">
        <img src={whiteLogoSimple} alt="Logo" className="w-[92px] h-[92px]" />
        <Text variant="h1" weight="bold" color="black" className="text-7xl">
          SE BUSCA A {pet.name.toUpperCase()}
        </Text>
        <img src={whiteLogoSimple} alt="Logo" className="w-[92px] h-[92px]" />
      </div>

      <div className="w-[1080px] h-[689px] flex flex-col items-center justify-center bg-[#F9F1DE]">
        {renderImages()}
        <div className="w-full flex justify-between items-center">
          <img src={phone} alt="Phone" className="w-[86px] h-[129px]" />
          <div className="flex flex-col justify-end items-center">
            <Text variant="h3" weight="regular">
              SI LE VES, LLAMA AL
            </Text>
            <Text variant="h2" weight="bold">
              {pet.phoneNumber}
            </Text>
          </div>
        </div>
      </div>

      <div className="w-[1080px] h-[188px] flex">
        <div className="w-[169px] h-[186px] flex flex-col justify-start items-center gap-2">
          <Text variant="body" weight="bold">
            FECHA
          </Text>
          <Text variant="body" weight="bold">
            ZONA
          </Text>
        </div>
        <div className="w-[911px] h-[186px] flex flex-col justify-start items-start gap-2">
          <Text variant="body" weight="regular">
            {pet.date}
          </Text>
          <Text variant="body" weight="regular">
            {pet.address}
          </Text>
        </div>
      </div>

      <div className="w-[1080px] h-[159px] flex">
        <div className="w-[540px] h-[159px] border-r border-r-[#968760]">
          <div className="w-[169px] h-[159px] flex flex-col justify-start items-center gap-2">
            <Text variant="body" weight="bold">
              TIPO/RAZA
            </Text>
            <Text variant="body" weight="bold">
              TALLA
            </Text>
          </div>
          <div className="w-[371px] h-[159px] flex flex-col justify-start items-start gap-2">
            <Text variant="body" weight="regular">
              {pet.breed}
            </Text>
            <Text variant="body" weight="regular">
              {pet.size}
            </Text>
          </div>
        </div>
        <div className="w-[540px] h-[159px] color-secondary-bg">
          <div className="w-[172px] h-[159px] flex flex-col justify-start items-center gap-2">
            <Text variant="body" weight="bold">
              COLOR
            </Text>
            <Text variant="body" weight="bold">
              SEXO
            </Text>
          </div>
          <div className="w-[368px] h-[159px] flex flex-col justify-start items-start gap-2">
            <Text variant="body" weight="regular">
              {pet.color}
            </Text>
            <Text variant="body" weight="regular">
              {pet.sex}
            </Text>
          </div>
        </div>
        <div className="w-[1080px] h-[148px] flex flex-col justify-start items-center gap-2">
          <Text variant="body" weight="bold">
            DETALLES
          </Text>
          <Text variant="body" weight="regular">
            {pet.description}
          </Text>
        </div>
        <div className="w-[1080px] h-[62px] flex justify-center items-center bg-[#9D7FAD]">
          <Text variant="body" weight="bold" color="white">
            www.sosencontrandomascotas.com
          </Text>
        </div>
      </div>
    </div>
  );
};
