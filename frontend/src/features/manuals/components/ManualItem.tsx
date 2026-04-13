import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import { ManualContent } from './ManualContent';

export const ManualItem = ({ manual }: { manual: any }) => {
  return (
    <div key={manual._id} className="bg-white rounded-lg color-grey-border">
      <img src={manual.imageUrl} alt={manual.name} className="rounded-lg" />
      <Text
        as="h3"
        variant="h3"
        weight="regular"
        color="text-black"
        className="pl-4 py-4 color-grey-border-top"
      >
        {manual.name}
      </Text>
      <Text
        as="h3"
        variant="h3"
        weight="medium"
        color="text-black"
        className="text-right pr-4 pb-4"
      >
        $ {manual.price}
      </Text>
      <div className="w-full flex flex-col items-center justify-center py-5 color-grey-border-top">
        <Button
          label="Ver"
          variant="plans"
          onClick={() => <ManualContent manual={manual} />}
        />
      </div>
    </div>
  );
};
