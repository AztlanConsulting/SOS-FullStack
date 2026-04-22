import type { PlanDetails } from '@features/plans/types/plan.types';
import { Text } from '@shared/components/ui/Text';

interface Props {
  plan: PlanDetails;
}

const PlanDetail = ({ plan }: Props) => {
  return (
    <div className="w-10/12">
      <ul>
        <Row label={'Plan seleccionado'} value={plan.name} />
        <Row label={'Duración'} value={plan.duration} />
        <Row label={'Distancia'} value={plan.radius} />
      </ul>
    </div>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="w-full flex justify-between">
      <Text color={'text-gray-800'}>{label}</Text>
      <Text weight="semibold" color={'text-gray-800'}>
        {value}
      </Text>
    </li>
  );
}

export default PlanDetail;
