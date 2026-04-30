import React from 'react';
import { Text } from '../../../shared/components/ui/Text';
import { Button } from '../../../shared/components/ui/Button';
import Checkbox from '../../../shared/components/ui/Checkbox/Checkbox';
import { useCustomPlan } from '../hooks/useCustomPlan';
import { usePetReport } from '@/shared/context/PetReportContext';
import { ALL_FEATURES } from '../hooks/useCustomPlan';

/**
 * CustomPlanCard Component.
 * Allows users to build a tailored plan by adjusting duration and radius via sliders,
 * and selecting optional features via checkboxes.
 * Prices and feature availability are updated in real-time based on the selected tier.
 */
const CustomPlanCard: React.FC = () => {
  const {
    days,
    km,
    tier,
    selectedFeatures,
    totalPrice,
    handleDaysChange,
    setKm,
    toggleFeature,
  } = useCustomPlan();

  const BASE_FEATURES = [
    'Publicación en nuestras redes sociales',
    'Video y lista de consejos de búsqueda',
    'Cartel para imprimir',
  ];

  const { lostPetReportData, setLostPetReportData } = usePetReport();

  return (
    <div className="w-full max-w-sm rounded-2xl border-2 border-[#AFB1B6] bg-white overflow-hidden">
      <div className="bg-[#F9CD48] border-b-2 border-[#AFB1B6] py-2 text-center">
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
            className="w-full accent-[#F9CD48] range-slider"
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
            className="w-full accent-[#F9CD48] range-slider"
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
                  {!isAvailable && (
                    <Text variant="small" className="text-[#FF3333]">
                      No disponible con los días o km actuales.
                    </Text>
                  )}
                </div>
                <Text
                  variant="small"
                  className={isAvailable ? 'text-gray-500' : 'text-gray-400'}
                >
                  {isAvailable ? `+${tierFeature?.price}` : 'No disponible'}
                </Text>
              </label>
            );
          })}
        </div>

        <div className="border-t border-gray-100" />

        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between">
            <Text variant="small" className="text-gray-500">
              Días ({days} x ${tier.pricePerDay.toFixed(2)})
            </Text>
            <Text variant="small" className="text-gray-700">
              ${(days * tier.pricePerDay).toFixed(2)}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text variant="small" className="text-gray-500">
              Radio ({km} km x ${tier.pricePerKm.toFixed(2)})
            </Text>
            <Text variant="small" className="text-gray-700">
              ${(km * tier.pricePerKm).toFixed(2)}
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
                  +${feature.price}
                </Text>
              </div>
            );
          })}
          <div className="flex justify-between mt-2">
            <Text variant="body" weight="bold" className="text-gray-900">
              Total
            </Text>
            <Text variant="body" weight="bold" className="text-gray-900">
              ${totalPrice.toFixed(2)}
            </Text>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            label="Confirmar plan"
            variant="plans"
            onClick={() => {
              if (!lostPetReportData) return;

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
                        return feature?.label || key;
                      }),
                    ]),
                  ),
                  totalPrice,
                },
              };

              setLostPetReportData(updated);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomPlanCard;
