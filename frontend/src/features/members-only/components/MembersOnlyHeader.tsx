import { Text } from '@shared/components/ui/Text';
import ProductPageHero from '@shared/components/layout/ProductPageHero';
import { formatDateEsShort } from '@shared/utils/dateUtils';
import yellowIcon from '@assets/images/yellowIcon.png';
import huskyHero from '@assets/images/sadDog.png';
import { Button } from '@shared/components/ui/Button';
import { FileDown } from 'lucide-react';
import type { MembersOnly } from '../types/membersOnly.types';

interface Props {
  membersOnly: MembersOnly;
}

const MembersOnlyHeader = ({ membersOnly }: Props) => {
  const createdAtLabel = formatDateEsShort(membersOnly.createdAt);
  const updatedAtLabel = formatDateEsShort(membersOnly.updatedAt);

  const heroProduct = {
    imageUrl: huskyHero,
    name: membersOnly.name,
    content: membersOnly.content,
    price: 0,
  };

  return (
    <div className="w-full bg-light-purple flex justify-center lg:px-12 xl:px-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-2xl xl:max-w-2xl py-6 md:py-8 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <img
            src={yellowIcon}
            alt="Logo"
            className="w-7 h-7 md:w-10 md:h-10"
          />
          <Text as="p" variant="caption" className="md:text-base">
            {createdAtLabel}
          </Text>
        </div>

        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] md:w-full md:left-0 md:right-0 md:ml-0 md:mr-0">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl md:px-0">
              <ProductPageHero
                product={{
                  ...heroProduct,
                  content: [
                    {
                      content: heroProduct.content,
                      type: 'paragraph',
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>

        <Text as="h1" variant="h2" weight="medium" className="pt-2">
          {membersOnly.name}
        </Text>

        <div className="flex justify-between items-center">
          <Text as="p" variant="small" className="md:text-base">
            Actualizado: {updatedAtLabel}
          </Text>
        </div>

        <Button
          label="Descargar manual de búsqueda"
          variant="purple"
          icon={FileDown}
        />
      </div>
    </div>
  );
};

export default MembersOnlyHeader;
