import { Button } from '@shared/components/ui/Button';
import React, { useState } from 'react';
import {
  HiCheck,
  HiOutlineX,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';
import { Text } from '@shared/components/ui/Text';
import { Modal } from '@shared/components/ui/Modal/Modal';

/**
 * Represents an individual feature or service within a plan.
 * Used to render list items with status icons and optional informational modals.
 */
export interface PlanFeature {
  label: string;
  included: boolean;
  tooltip?: string;
  tooltipTitle?: string;
}

/**
 * Props for the PlanCard component.
 * Includes visual styling flags (highlighted/badge) and service details.
 */
export interface PlanCardProps {
  name: string;
  price: string;
  currency?: string;
  duration: string;
  radius: string;
  features: PlanFeature[];
  onSelect: () => void;
  highlighted?: boolean;
  badge?: string;
}

/**
 * Component that displays a service plan with its features and pricing.
 * It handles its own state for displaying feature-specific information in a modal.
 */
const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  currency = '$',
  duration,
  radius,
  features,
  highlighted = false,
  badge,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const included = features.filter((f) => f.included);
  const excluded = features.filter((f) => !f.included);

  return (
    <div className="relative pt-4 md:h-full">
      {badge && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-white border-2 border-[#F9CD48] text-gray-800 text-medium font-medium px-4 py-2 rounded-full whitespace-nowrap">
            {badge}
          </span>
        </div>
      )}

      <div
        className={`relative w-full max-w-sm rounded-2xl border-2 bg-white overflow-hidden md:min-h-[550px] ${
          highlighted ? 'border-[#F9CD48]' : 'border-[#AFB1B6]'
        }`}
      >
        <div
          className={`bg-[#F9CD48] border-b-2 ${highlighted ? 'border-[#F9CD48]' : 'border-[#AFB1B6]'} py-3 text-center`}
        >
          <Text variant="body" weight="medium" className="text-white">
            {name}
          </Text>
        </div>

        <div className="flex flex-col items-center pt-5 pb-4">
          <Text variant="h2" weight="medium" className="text-gray-900">
            {currency} {price}
          </Text>
          <Text variant="body" className="text-gray-500 mt-1">
            {duration} / {radius}
          </Text>
        </div>

        <ul className="px-5 pb-5 flex flex-col gap-4 md:flex-1">
          {included.map((feature, i) => (
            <FeatureRow
              key={i}
              feature={feature}
              onTooltipClick={(tooltip) => setActiveTooltip(tooltip)}
            />
          ))}

          {excluded.map((feature, i) => (
            <FeatureRow
              key={i}
              feature={feature}
              onTooltipClick={(tooltip) => setActiveTooltip(tooltip)}
            />
          ))}
        </ul>

        <div className="flex justify-center pb-5">
          <Button
            label="Seleccionar"
            variant="plans"
            onClick={() => {
              console.log('CLick en plan: Santi le movio, esperence');
            }}
          />
        </div>
      </div>
      {activeTooltip && (
        <Modal
          title={activeTooltip.title}
          description={activeTooltip.description}
          onClose={() => setActiveTooltip(null)}
        />
      )}
    </div>
  );
};

/**
 * Internal sub-component to render a single row in the feature list.
 * Displays check/cross icons and triggers the info modal if a tooltip is provided.
 */
const FeatureRow: React.FC<{
  feature: PlanFeature;
  onTooltipClick: (tooltip: { title: string; description: string }) => void;
}> = ({ feature, onTooltipClick }) => (
  <li className="flex items-start gap-2.5 list-none">
    {feature.included ? (
      <HiCheck size={20} className="text-[#198754] shrink-0" />
    ) : (
      <HiOutlineX size={20} className="text-[#FF3333] shrink-0" />
    )}
    <span
      className={`text-sm leading-snug ${feature.included ? 'text-gray-800' : 'text-gray-400'}`}
    >
      {feature.label}
    </span>
    {feature.tooltip && (
      <button
        onClick={() =>
          onTooltipClick({
            title: feature.tooltipTitle ?? feature.label,
            description: feature.tooltip!,
          })
        }
        className="cursor-pointer"
      >
        <HiOutlineQuestionMarkCircle
          size={20}
          className="text-gray-400 shrink-0"
        />
      </button>
    )}
  </li>
);

export default PlanCard;
