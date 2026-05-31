import React, { useState } from 'react';
import { Text } from '../../../shared/components/ui/Text';
import { Button } from '../../../shared/components/ui/Button';
import Checkbox from '../../../shared/components/ui/Checkbox/Checkbox';
import { useCustomPlan } from '../hooks/useCustomPlan';
import { ALL_FEATURES } from '../hooks/useCustomPlan';
import { usePetReport } from '@/shared/context/PetReportContext';
import { useNavigate } from 'react-router';

/**
 * CustomPlanCard Component.
 * Allows users to build a tailored plan by adjusting duration and radius via sliders,
 * and selecting optional features via checkboxes.
 * Prices and feature availability are updated in real-time based on the selected tier.
 */
export interface CustomPlanCardProps {
  colorScheme?: 'yellow' | 'purple';
  checkoutPath?: string;
  userEmail?: string;
  userName?: string;
  petId?: string;
}

const CustomPlanCard: React.FC<CustomPlanCardProps> = ({
  colorScheme = 'yellow',
  checkoutPath = '/compra',
  userEmail = '',
  userName = '',
  petId = '',
}) => {
  const {
    days,
    km,
    tier,
    selectedFeatures,
    localizedTotalPrice,
    currencyCode,
    localize,
    handleDaysChange,
    setKm,
    toggleFeature,
  } = useCustomPlan(colorScheme);
  const navigate = useNavigate();

  const { lostPetReportData, setLostPetReportData } = usePetReport();

  const BASE_FEATURES = [
    'Publicación en nuestras redes sociales',
    'Video y lista de consejos de búsqueda',
    'Cartel para imprimir',
  ];

  const theme = {
    yellow: {
      accent: 'bg-[#F9CD48]',
      headerBorder: 'border-[#AFB1B6]',
      borderDefault: 'border-[#AFB1B6]',
      rangeAccent: 'accent-[#F9CD48]',
      buttonVariant: 'plans' as const,
    },
    purple: {
      accent: 'bg-purple',
      headerBorder: 'border-purple',
      borderDefault: 'border-purple-secondary',
      rangeAccent: 'accent-purple',
      buttonVariant: 'purplePlans' as const,
    },
  }[colorScheme];

  return (
    <div
      className={`w-full max-w-sm rounded-2xl border-2 ${theme.borderDefault} bg-white overflow-hidden`}
    >
      <div
        className={`${theme.accent} border-b-2 ${theme.headerBorder} py-2 text-center`}
      >
        <Text variant="body" weight="medium" className="text-white">
          Personalizado
        </Text>
      </div>

      <div className="px-5 pt-5 pb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Text variant="body" weight="medium" className="text-gray-800">
              Días
            </Text>
            <div className="flex items-center gap-2 w-24">
              <input
                type="text"
                value={days}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || !isNaN(Number(value))) {
                    handleDaysChange(Number(value));
                  }
                }}
                onBlur={(e) => {
                  const value = Number(e.target.value) || 0;
                  handleDaysChange(
                    value === 0 ? 3 : Math.min(30, Math.max(3, value)),
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = Number(e.currentTarget.value) || 0;
                    handleDaysChange(
                      value === 0 ? 3 : Math.min(30, Math.max(3, value)),
                    );
                  }
                }}
                className="w-12 px-1 py-0.5 border border-gray-300 rounded text-right text-gray-900 text-sm flex-shrink-0"
              />
              <Text variant="body" className="text-gray-900">
                {days == 1 ? 'día' : 'días'}
              </Text>
            </div>
          </div>
          <input
            type="range"
            min={3}
            max={30}
            step={1}
            value={days}
            onChange={(e) => handleDaysChange(Number(e.target.value))}
            className={`w-full ${theme.rangeAccent} range-slider`}
          />
          <div className="flex justify-between">
            <Text variant="small" className="text-gray-400">
              {' '}
              3 días
            </Text>
            <Text variant="small" className="text-gray-400">
              {' '}
              30 días
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Text variant="body" weight="medium" className="text-gray-800">
              Radio
            </Text>
            <div className="flex items-center gap-2 w-24">
              <input
                type="text"
                value={km}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || !isNaN(Number(value))) {
                    setKm(Number(value));
                  }
                }}
                onBlur={(e) => {
                  const value = Number(e.target.value) || 0;
                  setKm(value === 0 ? 5 : Math.min(40, Math.max(5, value)));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = Number(e.currentTarget.value) || 0;
                    setKm(value === 0 ? 5 : Math.min(40, Math.max(5, value)));
                  }
                }}
                className="w-12 px-1 py-0.5 border border-gray-300 rounded text-right text-gray-900 text-sm flex-shrink-0"
              />
              <Text variant="body" className="text-gray-900">
                km
              </Text>
            </div>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            className={`w-full ${theme.rangeAccent} range-slider`}
          />
          <div className="flex justify-between">
            <Text variant="small" className="text-gray-400">
              5 km
            </Text>
            <Text variant="small" className="text-gray-400">
              40 km
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Text variant="body" weight="medium" className="text-gray-800">
            Extras
          </Text>
          {ALL_FEATURES.map((feature) => {
            const tierFeature = tier.features.find(
              (tierFeature) => tierFeature.key === feature.key,
            );

            const isAvailable = Boolean(tierFeature);
            // setIsAvailable(Boolean(tierFeature))

            return (
              <label
                key={feature.key}
                className={`flex items-center justify-between gap-2 ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        isAvailable && selectedFeatures.includes(feature.key)
                      }
                      disabled={!isAvailable}
                      onChange={() => isAvailable && toggleFeature(feature.key)}
                    />
                    <Text variant="small" className="text-gray-700">
                      {feature.label}
                    </Text>
                  </div>
                </div>
                <Text
                  variant="small"
                  className={isAvailable ? 'text-gray-500' : 'text-green-500'}
                >
                  {isAvailable
                    ? `+${currencyCode} ${localize(tierFeature!.price).toFixed(2)}`
                    : 'Incluido'}
                </Text>
              </label>
            );
          })}
        </div>

        <div className="border-t border-gray-100" />

        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between">
            <Text variant="small" className="text-gray-500">
              Días ({days} x {currencyCode}{' '}
              {localize(tier.pricePerDay).toFixed(2)})
            </Text>
            <Text variant="small" className="text-gray-700">
              {currencyCode} {localize(days * tier.pricePerDay).toFixed(2)}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text variant="small" className="text-gray-500">
              Radio ({km} km x {currencyCode}{' '}
              {localize(tier.pricePerKm).toFixed(2)})
            </Text>
            <Text variant="small" className="text-gray-700">
              {currencyCode} {localize(km * tier.pricePerKm).toFixed(2)}
            </Text>
          </div>
          {selectedFeatures.map((key) => {
            const feature = tier.features.find((a) => a.key === key);
            if (!feature) return null;
            return (
              <div key={key} className="flex justify-between">
                <Text variant="small" className="text-gray-500">
                  {feature.label}
                </Text>
                <Text variant="small" className="text-gray-700">
                  +{currencyCode} {localize(feature.price).toFixed(2)}
                </Text>
              </div>
            );
          })}
          <div className="flex justify-between mt-2">
            <Text variant="body" weight="bold" className="text-gray-900">
              Total
            </Text>
            <Text variant="body" weight="bold" className="text-gray-900">
              {currencyCode}{' '}
              {localizedTotalPrice
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            label="Confirmar plan"
            variant={theme.buttonVariant}
            onClick={() => {
              if (colorScheme === 'purple') {
                const selectedPlan = {
                  name: 'Personalizado',
                  price: localizedTotalPrice,
                  duration: days,
                  radius: km,
                  features: Array.from(
                    new Set([
                      ...BASE_FEATURES,
                      ...selectedFeatures.map((key) => {
                        const feature = tier.features.find(
                          (f) => f.key === key,
                        );
                        return feature?.label || key;
                      }),
                    ]),
                  ),
                  petId: petId,
                };

                navigate(checkoutPath, {
                  replace: true,
                  state: {
                    productType: 'plan-extension',
                    productId: petId,
                    userEmail,
                    userName,
                    selectedPlan,
                  },
                });
                return;
              }

              // yellow / public flow - preserve existing PetReportContext behavior
              if (!lostPetReportData) return navigate('/#report-section');

              const dynamicFeature = `Anuncio de ${days} días en un área de ${km} km a la redonda`;

              const updated = {
                ...lostPetReportData,
                planName: 'Personalizado',
                planDetails: {
                  days,
                  km,
                  selectedFeatures: Array.from(
                    new Set([
                      dynamicFeature,
                      ...BASE_FEATURES,
                      ...selectedFeatures.map((key) => {
                        const feature = tier.features.find(
                          (f) => f.key === key,
                        );
                        return feature?.key || key;
                      }),
                    ]),
                  ),
                  totalPrice: localizedTotalPrice,
                },
              };

              if (days >= 6)
                updated.planDetails.selectedFeatures.push(
                  ...ALL_FEATURES.map((v) => v.key).slice(0, 2),
                );

              setLostPetReportData(updated);
              navigate('/compra');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomPlanCard;
