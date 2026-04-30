import PlanCard, {
  type PlanCardProps,
} from '@features/plans/components/PlanCard';
import Header from '@/shared/components/layout/Header';
import { Text } from '@shared/components/ui/Text';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { usePetReport } from '@/shared/context/PetReportContext';
import { Button } from '@shared/components/ui/Button/Button';
import { usePlans } from '@features/plans/hooks/usePlans';
import { useNavigate } from 'react-router';

/**
 * PlansPage Component.
 * * Displays the available service plans to the user.
 * It features a responsive design:
 * - Desktop: Horizontal grid/flex layout showing all plans side-by-side.
 * - Mobile: A carousel/slider view with navigation arrows and pagination dots.
 */
export default function PlansPage() {
  const { plans, loading, error } = usePlans();
  const [current, setCurrent] = useState(0);
  const { lostPetReportData, setLostPetReportData } = usePetReport();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lostPetReportData) {
      navigate('/');
    }
  }, [lostPetReportData, navigate]);

  const handleSelectPlan = (plan: PlanCardProps) => {
    if (!lostPetReportData) return;

    const updated = {
      ...lostPetReportData,
      planName: plan.name,
      planDetails: {
        days: parseInt(plan.duration) || 0,
        km: parseInt(plan.radius) || 0,
        selectedFeatures: plan.features
          .filter((f) => f.included)
          .map((f) => f.label),
        totalPrice: Number(plan.price),
      },
    };

    setLostPetReportData(updated);
  };

  /**
   * Navigation handlers for the mobile carousel view.
   */
  const prev = () => setCurrent((i) => Math.max(i - 1, 0));
  const next = () => setCurrent((i) => Math.min(i + 1, plans.length - 1));

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FEF5DA] flex items-center justify-center">
          <p className="text-gray-500">Cargando planes...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FEF5DA] flex items-center justify-center">
          <p className="text-red-400">Error al cargar los planes.</p>
        </main>
      </>
    );
  }

  if (plans.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FEF5DA] flex items-center justify-center">
          <p className="text-gray-500">No se encontraron planes.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FEF5DA] flex flex-col items-center py-8 pt-28 lg:pt-8">
        <Text
          variant="h2"
          weight="medium"
          as="h2"
          className="text-2xl lg:text-2xl text-gray-900 mb-2"
        >
          {' '}
          Planes{' '}
        </Text>
        <div className="hidden md:flex flex-row gap-10 w-full justify-center items-stretch">
          {plans.map((plan, i) => (
            <PlanCard
              key={i}
              {...plan}
              onSelect={() => handleSelectPlan(plan)}
            />
          ))}
        </div>

        <div className="flex md:hidden items-center w-full justify-evenly">
          <div className="w-1/12 flex justify-start">
            <button
              onClick={prev}
              disabled={current === 0}
              className="p-1.5 rounded-full bg-white border-[3.5px] border-[#61646B] disabled:opacity-30 shrink-0"
            >
              <HiArrowLeft
                size={17}
                style={{ strokeWidth: 3 }}
                className="text-[#61646B]"
              />
            </button>
          </div>

          <div className="w-9/12">
            <PlanCard
              {...plans[current]}
              onSelect={() => handleSelectPlan(plans[current])}
            />
          </div>
          <div className="w-1/12 flex justify-end">
            <button
              onClick={next}
              disabled={current === plans.length - 1}
              className="p-1.5 rounded-full bg-white border-[3.5px] border-[#61646B] disabled:opacity-30 shrink-0"
            >
              <HiArrowRight
                size={17}
                style={{ strokeWidth: 3 }}
                className="text-[#61646B]"
              />
            </button>
          </div>
        </div>

        <div className="flex md:hidden gap-2 mt-4">
          {plans.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-17 bg-[#AFB1B6]' : 'w-6 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center pb-5 mt-5  w-75 sm:w-10/12 md:w-auto">
          <Button
            label="¿No es lo que buscas? Personalízalo"
            variant="danger"
            icon={HiArrowRight}
            onClick={() => navigate('/planes/personalizado')}
          />
        </div>
      </main>
    </>
  );
}
