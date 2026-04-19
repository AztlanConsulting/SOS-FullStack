import { useState, useMemo } from 'react';
import { getTier, calculatePrice } from '../components/customPlan';

export const useCustomPlan = () => {
  const [days, setDays] = useState(3);
  const [km, setKm] = useState(5);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const tier = useMemo(() => getTier(days), [days]);

  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleDaysChange = (newDays: number) => {
    const newTier = getTier(newDays);
    const currentTier = getTier(days);
    if (newTier.minDays !== currentTier.minDays) {
      setSelectedFeatures([]);
    }
    setDays(newDays);
  };

  const totalPrice = useMemo(
    () => calculatePrice(days, km, selectedFeatures),
    [days, km, selectedFeatures],
  );

  const warnings: string[] = [];
  if (km > 20 && days < 3) {
    warnings.push(
      'Sugerencia SOS: Para un radio de este tamaño, recomendamos al menos 3 días para garantizar que el algoritmo de pauta alcance a toda la audiencia.',
    );
  }
  if (km > 50) {
    warnings.push(
      'Nota: Radios de búsqueda muy amplios pueden dispersar la atención. Asegúrate de que tu mascota tiene alta movilidad antes de confirmar.',
    );
  }

  return {
    days,
    km,
    tier,
    selectedFeatures,
    totalPrice,
    warnings,
    handleDaysChange,
    setKm,
    toggleFeature,
  };
};
