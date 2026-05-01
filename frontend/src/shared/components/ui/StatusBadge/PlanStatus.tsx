import type { PlanStatus } from '@/features/clients/types/client.type';

const STATUS_STYLES: Record<PlanStatus, { className: string; label: string }> =
  {
    continua: { className: 'bg-green-100 text-green-800', label: 'Continua' },
    'casi expira': {
      className: 'bg-yellow-100 text-yellow-800',
      label: 'Casi expira',
    },
    expirado: { className: 'bg-red-100 text-red-800', label: 'Expirado' },
    RIP: { className: 'bg-gray-100 text-gray-600', label: 'RIP' },
  };

interface Props {
  status: PlanStatus;
}

export const PlanStatusBadge = ({ status }: Props) => {
  const { className, label } = STATUS_STYLES[status] ?? STATUS_STYLES['RIP'];
  return (
    <span
      className={`${className} text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap w-full text-center block`}
    >
      {label}
    </span>
  );
};
