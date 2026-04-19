export type feature = {
  key: string;
  label: string;
  price: number;
};

export type PricingTier = {
  minDays: number;
  maxDays: number;
  pricePerDay: number;
  pricePerKm: number;
  features: feature[];
};

export type FeatureInfo = {
  key: string;
  label: string;
};

export const ALL_FEATURES: FeatureInfo[] = [
  { key: 'asesor', label: 'Asesor de búsqueda' },
  { key: 'geo_dinamica', label: 'Geolocalización dinámica' },
  { key: 'geo_doble', label: 'Geolocalización doble' },
  { key: 'reel', label: 'Reel de Instagram y Facebook' },
];

const getPricingTiers = (): PricingTier[] => [
  {
    minDays: 1,
    maxDays: 4,
    pricePerDay: 80,
    pricePerKm: 15,
    features: [
      { key: 'asesor', label: 'Asesor de búsqueda', price: 50 },
      { key: 'geo_dinamica', label: 'Geolocalización dinámica', price: 50 },
      { key: 'geo_doble', label: 'Geolocalización doble', price: 50 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 50 },
    ],
  },
  {
    minDays: 5,
    maxDays: 6,
    pricePerDay: 75,
    pricePerKm: 12.5,
    features: [
      { key: 'asesor', label: 'Asesor de búsqueda', price: 80 },
      { key: 'geo_dinamica', label: 'Geolocalización dinámica', price: 80 },
      { key: 'geo_doble', label: 'Geolocalización doble', price: 80 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 80 },
    ],
  },
  {
    minDays: 7,
    maxDays: 14,
    pricePerDay: 72,
    pricePerKm: 11.2,
    features: [
      { key: 'geo_doble', label: 'Geolocalización doble', price: 100 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 50 },
    ],
  },
  {
    minDays: 15,
    maxDays: 30,
    pricePerDay: 72,
    pricePerKm: 13,
    features: [
      { key: 'geo_doble', label: 'Geolocalización doble', price: 100 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 50 },
    ],
  },
];

export const getTier = (days: number): PricingTier => {
  return getPricingTiers().find(
    (t) => days >= t.minDays && days <= t.maxDays,
  ) as PricingTier;
};

export const calculatePrice = (
  days: number,
  km: number,
  selectedFeatures: string[],
): number => {
  const tier = getTier(days);
  const basePrice = days * tier.pricePerDay + km * tier.pricePerKm;
  const featuresPrice = tier.features
    .filter((f) => selectedFeatures.includes(f.key))
    .reduce((sum, f) => sum + f.price, 0);
  return basePrice + featuresPrice;
};
