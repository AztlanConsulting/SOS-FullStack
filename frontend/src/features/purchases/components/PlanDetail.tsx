import type { PetReportData } from '@/features/users/types/petReport.types';
import { Text } from '@shared/components/ui/Text';

interface Props {
  reportData: PetReportData;
}

const PlanDetail = ({ reportData }: Props) => {
  console.log('PlanDetail', reportData);
  return (
    <div className="w-10/12">
      <ul>
        <Row label={'Plan seleccionado'} value={reportData.planName} />
        <Row
          label={'Duración'}
          value={String(reportData.planDetails!.days) + ' días'}
        />
        <Row
          label={'Distancia'}
          value={String(reportData.planDetails!.km) + ' km'}
        />
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
