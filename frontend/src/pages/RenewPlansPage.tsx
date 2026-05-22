import PlanCard, {
  type PlanCardProps,
} from '@features/plans/components/PlanCard';
import { RENEW_PLANS } from '@features/plans/components/renewPlans';
import Header from '@/shared/components/layout/Header';
import { Text } from '@shared/components/ui/Text';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';
import { Button } from '@shared/components/ui/Button/Button';
import { useNavigate } from 'react-router';

export default function RenewPlansPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const handleSelectPlan = (plan: PlanCardProps) => {
    navigate('/renovar-planes', { replace: true, state: { plan } });
  };

  const prev = () => setCurrent((i) => Math.max(i - 1, 0));
  const next = () => setCurrent((i) => Math.min(i + 1, RENEW_PLANS.length - 1));

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
          Renovar Plan
        </Text>
        <div className="hidden md:flex flex-row gap-10 w-full justify-center items-stretch">
          {RENEW_PLANS.map((plan, i) => (
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
              {...RENEW_PLANS[current]}
              colorScheme="purple"
              onSelect={() => handleSelectPlan(RENEW_PLANS[current])}
            />
          </div>
          <div className="w-1/12 flex justify-end">
            <button
              onClick={next}
              disabled={current === RENEW_PLANS.length - 1}
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
          {RENEW_PLANS.map((_, i) => (
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
