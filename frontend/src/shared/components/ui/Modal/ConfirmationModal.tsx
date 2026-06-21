import { Text } from '@/shared/components/ui/Text';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import { Button } from '@/shared/components/ui/Button';
import { HiExclamationCircle } from 'react-icons/hi';

/**
 * Configuration properties for the ConfirmationModal component.
 */
type ConfirmationModalProps = {
  /** Title displayed in the shared Modal header. */
  title: string;
  /** Message that explains the action the administrator is confirming. */
  description: string;
  /** Label for the primary confirmation button. */
  confirmLabel?: string;
  /** Label for the secondary cancel button. */
  cancelLabel?: string;
  /** Optional error message shown when the confirmed action fails. */
  errorMessage?: string | null;
  /** Loading state used to disable actions while the request is pending. */
  isLoading?: boolean;
  /** Visual emphasis for regular or destructive actions. */
  tone?: 'warning' | 'danger';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

/**
 * A reusable confirmation dialog for administration actions.
 * Uses the shared Modal shell and keeps confirmation-specific content and actions inside.
 */
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
  const confirmButtonClass = isDanger
    ? 'bg-[var(--color-danger)] text-white hover:bg-[var(--color-status-danger)] focus:ring-[var(--color-danger-bg)]'
    : 'bg-primary text-white hover:opacity-90 focus:ring-[var(--color-secondary)]';

  // Prevent closing the dialog while the confirmed action is still in progress.
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
          <div id="confirmation-modal-description">
            <Text variant="body" color="text-gray-600" as="p">
              {description}
            </Text>
          </div>
        </div>

        {errorMessage && (
          <Text variant="small" color="text-[var(--color-danger)]">
            {errorMessage}
          </Text>
        )}

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            label={cancelLabel}
            onClick={handleCancel}
            variant="secondary"
            disabled={isLoading}
            textColor={`border border-[var(--color-grey-border)] bg-white text-gray-600 hover:bg-[var(--color-grey-bg)]`}
          />
          <Button
            label={confirmLabel}
            onClick={onConfirm}
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
            textColor={`${confirmButtonClass}`}
          />
        </div>
      </div>
    </Modal>
  );
};
