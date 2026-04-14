import PlanCard from '../features/plans/components/PlanCard';
import { PLANS } from '../features/plans/components/plans';
import Header from '../shared/components/layout/header';
import { Text } from '../shared/components/ui/Text';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';
import { Button } from '@shared/components/ui/Button/Button';

export default function PlansPage() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => Math.max(i - 1, 0));
  const next = () => setCurrent((i) => Math.min(i + 1, PLANS.length - 1));
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FEF5DA] flex flex-col items-center py-8">
        <Text
          variant="h2"
          weight="medium"
          as="h2"
          className="text-gray-900 mb-6"
        >
          {' '}
          Planes{' '}
        </Text>
        <div className="hidden md:flex flex-row gap-10 w-full justify-center items-stretch">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={i}
              {...plan}
              onSelect={() => console.log(plan.name)}
            />
          ))}
        </div>

        <div className="flex md:hidden items-center w-full justify-evenly">
          <div className="w-1/12 flex justify-start">
            <button
              onClick={prev}
              disabled={current === 0}
              className="p-1.5 rounded-full bg-white border-[3.5px] border-[#F9CD48] disabled:opacity-30 shrink-0"
            >
              <HiArrowLeft size={13} className="text-[#F9CD48]" />
            </button>
          </div>

          <div className="w-9/12">
            <PlanCard
              {...PLANS[current]}
              onSelect={() => console.log(PLANS[current].name)}
            />
          </div>
          <div className="w-1/12 flex justify-end">
            <button
              onClick={next}
              disabled={current === PLANS.length - 1}
              className="p-1.5 rounded-full bg-white border-[3.5px] border-[#F9CD48] disabled:opacity-30 shrink-0"
            >
              <HiArrowRight size={13} className="text-[#F9CD48]" />
            </button>
          </div>
        </div>

        <div className="flex md:hidden gap-2 mt-4">
          {PLANS.map((_, i) => (
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
            onClick={() => console.log('Personalizar')}
          />
        </div>
      </main>
    </>
  );
}
