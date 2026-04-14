import { ManualContent } from '@features/manuals/components/ManualContent';
import { useLocation } from 'react-router';
import { useEffect } from 'react';

export function ManualPage() {
  const { state } = useLocation();
  const manual = state?.manual;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        {manual ? (
          <ManualContent manual={manual} />
        ) : (
          <div>Manual not found</div>
        )}
      </main>
    </div>
  );
}
