import { Button } from '@/shared/components/ui';

interface Props {
  loading: boolean;
  successLabel: string;
  closeLabel: string;
  save: () => void;
  close: () => void;
}

const BlogModalActions = ({
  loading,
  successLabel,
  closeLabel,
  save,
  close,
}: Props) => {
  return (
    <div className=" flex flex-col lg:flex-row-reverse color-grey-border-top gap-4 px-5 py-4">
      <Button
        variant="primary"
        label={successLabel}
        isLoading={loading}
        disabled={loading}
        onClick={save}
      />
      <Button
        variant="secondary"
        label={closeLabel}
        disabled={loading}
        onClick={close}
      />
    </div>
  );
};

export default BlogModalActions;
