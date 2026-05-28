import { Text } from '@/shared/components/ui/Text';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import { HiExclamationCircle } from 'react-icons/hi';

type ConfirmationModalProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  errorMessage?: string | null;
  isLoading?: boolean;
  tone?: 'warning' | 'danger';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  errorMessage,
  isLoading = false,
  tone = 'warning',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  const isDanger = tone === 'danger';
  const accentClass = isDanger ? 'text-[var(--color-danger)]' : 'text-primary';
  const confirmClass = isDanger
    ? 'bg-[var(--color-danger)] hover:bg-[var(--color-status-danger)] focus:ring-[var(--color-danger-bg)]'
    : 'bg-primary hover:opacity-90 focus:ring-[var(--color-secondary)]';
  const handleCancel = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  return (
    <Modal title={title} onClose={handleCancel}>
      <div
        className="flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby="confirmation-modal-description"
      >
        <div className="flex items-start gap-3">
          <HiExclamationCircle
            size={28}
            className={`${accentClass} mt-0.5 shrink-0`}
          />
          <p
            id="confirmation-modal-description"
            className="text-base font-normal leading-relaxed text-[var(--color-grey-text)]"
          >
            {description}
          </p>
        </div>

        {errorMessage && (
          <Text variant="small" color="text-[var(--color-danger)]">
            {errorMessage}
          </Text>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-md border border-[var(--color-grey-border)] px-4 py-2 text-sm font-medium text-[var(--color-grey-text)] transition-colors hover:bg-[var(--color-grey-bg)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`${confirmClass} rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isLoading ? 'Guardando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
