import { Text } from '@/shared/components/ui/Text/Text';
import type { PetInfoDetailed } from '../types/petCollection.types';

interface Props {
  petInfo: PetInfoDetailed;
}

const PetContent = ({ petInfo }: Props) => {
  return (
    <div className="w-10/12 md:w-1/2 mx-auto h-full flex flex-col gap-3 mb-10">
      <div>
        <Segment
          important
          label={'Especie de la mascota'}
          content={petInfo.species}
        />
        <Segment label={'Fecha de encuentro'} content={petInfo.date} />
        <Segment label={'Lugar de encuentro'} content={petInfo.location} />
        <Segment label={'Raza / tipo de la mascota'} content={petInfo.breed} />
        <Segment important label={'Sexo de la mascota'} content={petInfo.sex} />
        <Segment label={'Color de la mascota'} content={petInfo.color} />
        <Segment
          important
          label={'Talla de la mascota'}
          content={petInfo.size}
        />
        <Segment
          important
          label={'Descripción adicional de la mascota'}
          content={petInfo.details}
        />
        <Segment
          label={'Nombre de la persona que la encontró'}
          content={petInfo.contactName}
        />
        <Segment label={'Número de teléfono'} content={petInfo.phoneNumber} />
        <Segment
          label={'Correo electrónico de quien la encontró'}
          content={petInfo.email}
        />
      </div>
    </div>
  );
};

interface SegmentProps {
  important?: boolean;
  label: string;
  content: string;
}

const Segment = ({ important = false, label, content }: SegmentProps) => {
  const Details = () => {
    return important ? (
      <div className="bg-purple-secondary border-[1px] border-purple-primary px-4 rounded-sm w-fit">
        <Text color="text-dark-purple">{content}</Text>
      </div>
    ) : (
      <div>
        <Text>{content}</Text>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 mb-4">
      <Text color="text-gray-500">{label}</Text>
      <Details />
    </div>
  );
};

export default PetContent;
