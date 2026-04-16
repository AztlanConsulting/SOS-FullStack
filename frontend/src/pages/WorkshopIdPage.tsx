import WorkshopContent from '@features/workshop/components/WorkshopContent';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const WorkshopIdPage = () => {
  const { state } = useLocation();
  const workshop = state?.workshop;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        {workshop ? (
          <WorkshopContent workshop={workshop} />
        ) : (
          <div>Taller no encontrado</div>
        )}
      </main>
    </div>
  );
};

export default WorkshopIdPage;
