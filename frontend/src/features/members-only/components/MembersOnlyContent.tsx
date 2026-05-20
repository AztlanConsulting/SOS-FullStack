import type { MembersOnly } from '../types/membersOnly.types';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import MembersOnlyHeader from './MembersOnlyHeader';
import { Text } from '@shared/components/ui/Text';

interface Props {
  membersOnly: MembersOnly;
  onBack?: () => void;
}

const MembersOnlyContent = ({ membersOnly, onBack }: Props) => {
  return (
    <section className="w-full min-h-screen flex flex-col">
      <HeaderBack name="Contenido Exclusivo" onBack={onBack} />
      <MembersOnlyHeader membersOnly={membersOnly} />
      <div className="w-full bg-white flex justify-center py-6 md:py-10">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-2xl xl:max-w-2xl flex flex-col gap-6">
          {membersOnly.content.split('\n\n').map((paragraph, idx) => (
            <Text key={idx} as="p" variant="body" weight="regular">
              {paragraph}
            </Text>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembersOnlyContent;
