import PlanCard, {
  type PlanCardProps,
} from '@features/plans/components/PlanCard';
import Header from '@/shared/components/layout/Header';
import { Text } from '@shared/components/ui/Text';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { Button } from '@shared/components/ui/Button/Button';
import { usePlans } from '@features/plans/hooks/usePlans';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@features/auth/hooks/useAuth';

export default function ExtenderPlanPage() {
  const { plans, loading, error } = usePlans(true);
  const [current, setCurrent] = useState(0);
  const location = useLocation();
  const { petId } = (location.state ?? {}) as { petId?: string };
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!petId) {
      navigate('/');
    }
  }, [petId, navigate]);

  const handleSelectPlan = (plan: PlanCardProps) => {
    if (!petId) return;

    navigate('/compra', {
      replace: true,
      state: {
        productType: 'plan-extension',
        productId: petId,
        userEmail: user?.email ?? '',
        userName: user?.username ?? '',
        petId,
        selectedPlan: {
          name: plan.name,
          price: Number(plan.price),
          duration: parseInt(plan.duration) || 0,
          radius: parseInt(plan.radius) || 0,
          features: plan.features
            .filter((feature) => feature.included)
            .map((feature) => feature.label),
        },
      },
    });
  };

  const prev = () => setCurrent((i) => Math.max(i - 1, 0));
  const next = () => setCurrent((i) => Math.min(i + 1, plans.length - 1));

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-purple-secondary flex items-center justify-center">
          <p className="text-gray-500">Cargando planes...</p>
        </main>
      </>
    );
  }

  if (error) {
    console.log('Error loading plans:', error);
    return (
      <>
        <Header />
        <main className="min-h-screen bg-purple-secondary flex items-center justify-center">
          <p className="text-red-400">Error al cargar los planes.</p>
        </main>
      </>
    );
  }

  if (plans.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-purple-secondary flex items-center justify-center">
          <p className="text-gray-500">No se encontraron planes.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-purple-secondary flex flex-col items-center py-8 pt-28 lg:pt-8">
        <Text
          variant="h2"
          weight="medium"
          as="h2"
          className="text-2xl lg:text-2xl text-gray-900 mb-2"
        >
          Extender plan
        </Text>
        <div className="hidden md:flex flex-row gap-10 w-full justify-center items-stretch">
          {plans.map((plan, i) => (
            <PlanCard
              key={i}
              {...plan}
              colorScheme="purple"
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
              colorScheme="purple"
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

        <div className="flex justify-center pb-5 mt-5 w-75 sm:w-10/12 md:w-auto">
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
