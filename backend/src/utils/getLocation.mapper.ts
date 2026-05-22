import type { GeocodingResult } from '@/types/pet.types';

export default async function getLocation(
  coords: [number, number],
): Promise<GeocodingResult | null> {
  const [lat, lon] = coords;
  const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=default`;

  const res = await fetch(url);

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const feature = data?.features?.[0];
  if (!feature?.properties) {
    return null;
  }

  const props = feature.properties;

  const address = [props.name, props.street, props.city, props.country]
    .filter(Boolean)
    .join(', ')
    .trim();

  const location = {
    coords,
    displayName: address,
    properties: {
      city: props.city ?? props.state,
      country: props.country,
      state: props.state,
    },
  };

  return location || null;
}
