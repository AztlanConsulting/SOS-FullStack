import type { PlanStatus } from '@/features/clients/types/client.type';

const STATUS_STYLES: Record<PlanStatus, { className: string; label: string }> =
  {
    continua: { className: 'bg-green-500 text-white', label: 'Continua' },
    'casi expira': {
      className: 'bg-yellow-400 text-white',
      label: 'Casi expira',
    },
    expirado: { className: 'bg-red-500 text-white', label: 'Expirado' },
    RIP: { className: 'bg-gray-300 text-gray-600', label: 'RIP' },
    encontrado: { className: 'bg-blue-500 text-white', label: 'Encontrado' },
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
