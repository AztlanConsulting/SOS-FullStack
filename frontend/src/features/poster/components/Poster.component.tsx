import { forwardRef } from 'react';
import type { PetReportData } from '@features/poster/types/petReportData.types';
import { Text } from '@shared/components/ui/Text/Text';
import whiteLogoSimple from '@assets/images/whiteLogoSimple.png';
import phone from '@assets/images/phone.png';

export const Poster = forwardRef<HTMLDivElement, { pet: PetReportData }>(
  ({ pet }, ref) => {
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
                className="w-[425px] h-[550px] object-cover"
              />
              <img
                src={URL.createObjectURL(pet.images[1])}
                className="w-[425px] h-[550px] object-cover"
              />
            </div>
          );

        case '3':
          return (
            <div className="grid grid-cols-2 grid-rows-2 w-[850px] h-[550px]">
              <img
                src={URL.createObjectURL(pet.images[0])}
                className="w-[425px] h-[275px] object-cover col-start-1 row-start-1"
              />
              <img
                src={URL.createObjectURL(pet.images[1])}
                className="w-[425px] h-[275px] object-cover col-start-1 row-start-2"
              />
              <img
                src={URL.createObjectURL(pet.images[2])}
                className="w-[425px] h-[550px] object-cover col-start-2 row-start-1 row-span-2"
              />
            </div>
          );

        case '4':
          return (
            <div className="grid grid-cols-2 grid-rows-2 w-[850px] h-[550px]">
              <img
                src={URL.createObjectURL(pet.images[0])}
                className="w-[425px] h-[275px] object-cover col-start-1 row-start-1"
              />
              <img
                src={URL.createObjectURL(pet.images[1])}
                className="w-[425px] h-[275px] object-cover col-start-1 row-start-2"
              />
              <img
                src={URL.createObjectURL(pet.images[2])}
                className="w-[425px] h-[275px] object-cover col-start-2 row-start-1"
              />
              <img
                src={URL.createObjectURL(pet.images[3])}
                className="w-[425px] h-[275px] object-cover col-start-2 row-start-2"
              />
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        id="poster"
        className="w-[1080px] h-[1350px] flex flex-col bg-white"
      >
        <div className="color-primary-bg h-[104px] w-[1080px] flex items-center justify-evenly">
          <img src={whiteLogoSimple} alt="Logo" className="w-[92px] h-[92px]" />
          <Text
            variant="body"
            weight="bold"
            color="black"
            className="text-[64px]"
          >
            SE BUSCA A{' '}
            <span className="underline">{pet.name.toUpperCase()}</span>
          </Text>
          <img src={whiteLogoSimple} alt="Logo" className="w-[92px] h-[92px]" />
        </div>

        <div className="w-[1080px] h-[689px] flex flex-col items-center justify-end bg-[#F9F1DE]">
          {renderImages()}
          <div className="w-[850px] flex justify-between items-center">
            <img src={phone} alt="Phone" className="w-[86px] h-[120px]" />
            <div className="flex flex-col justify-center items-end">
              <Text variant="body" weight="regular" className="text-[34px]">
                SI LE VES, LLAMA AL
              </Text>
              <Text variant="body" weight="bold" className="text-[46px]">
                {pet.phoneNumber}
              </Text>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="w-[1080px] min-h-[120px] flex flex-col pt-[10px] pb-[20px] gap-1">
            <div className="w-[1080px] min-h-[63px] flex justify-start items-center gap-2">
              <div className="w-[140px] flex items-center">
                <Text
                  variant="body"
                  weight="bold"
                  className="text-[26px] ps-[20px]"
                >
                  FECHA
                </Text>
              </div>
              <div className="w-[940px] flex items-center">
                <Text variant="body" weight="medium" className="text-[25px]">
                  {pet.date}
                </Text>
              </div>
            </div>

            <div className="w-[1080px] min-h-[60px] flex justify-evenly items-start gap-2">
              <div className="w-[140px]">
                <Text
                  variant="body"
                  weight="bold"
                  className="text-[26px] ps-[20px]"
                >
                  ZONA
                </Text>
              </div>
              <div className="w-[940px]">
                <Text
                  variant="body"
                  weight="medium"
                  className="text-[25px] leading-tight pr-[15px]"
                >
                  {pet.address}
                </Text>
              </div>
            </div>
          </div>

          <div className="w-[1080px] flex-1 flex color-secondary-bg">
            <div className="w-[540px] h-full flex flex-col border-r border-r-[#968760] gap-2">
              <div className="flex-1 flex justify-start items-start gap-2">
                <div className="w-[140px] pt-[17px]">
                  <Text
                    variant="body"
                    weight="bold"
                    className="text-[26px] ps-[20px]"
                  >
                    TIPO/
                    <br />
                    RAZA
                  </Text>
                </div>
                <div className="w-[400px] pt-[17px] pr-[15px]">
                  <Text variant="body" weight="medium" className="text-[25px]">
                    {pet.breed}
                  </Text>
                </div>
              </div>

              <div className="flex-1 flex justify-start items-end gap-2">
                <div className="w-[140px] pb-[17px] flex items-start">
                  <Text
                    variant="body"
                    weight="bold"
                    className="text-[26px] ps-[20px]"
                  >
                    TALLA
                  </Text>
                </div>
                <div className="w-[400px] pb-[17px] flex items-start">
                  <Text variant="body" weight="medium" className="text-[25px]">
                    {pet.size}
                  </Text>
                </div>
              </div>
            </div>

            <div className="w-[540px] h-full flex flex-col gap-2">
              <div className="flex-1 flex justify-start items-start gap-2">
                <div className="w-[140px] pt-[17px]">
                  <Text
                    variant="body"
                    weight="bold"
                    className="text-[26px] ps-[20px]"
                  >
                    COLOR
                  </Text>
                </div>
                <div className="w-[400px] pt-[17px] pr-[15px]">
                  <Text variant="body" weight="medium" className="text-[25px]">
                    {pet.color}
                  </Text>
                </div>
              </div>

              <div className="flex-1 flex justify-start items-end gap-2">
                <div className="w-[140px] pb-[17px] flex items-start">
                  <Text
                    variant="body"
                    weight="bold"
                    className="text-[26px] ps-[20px]"
                  >
                    SEXO
                  </Text>
                </div>
                <div className="w-[400px] pb-[17px] flex items-start">
                  <Text variant="body" weight="medium" className="text-[25px]">
                    {pet.sex}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[1080px] h-[148px] flex flex-col justify-evenly items-start">
          <Text variant="body" weight="bold" className="text-[26px] ms-[20px]">
            DETALLES
          </Text>
          <Text
            variant="body"
            weight="medium"
            className="text-[25px] ms-[20px] pb-[10px] pr-[15px]"
          >
            {pet.description}
          </Text>
        </div>
        <div className="w-[1080px] h-[62px] flex justify-center items-center bg-[#9D7FAD]">
          <Text variant="body" weight="bold" className="text-[40px] text-white">
            www.sosencontrandomascotas.com
          </Text>
        </div>
      </div>
    );
  },
);

Poster.displayName = 'Poster';
