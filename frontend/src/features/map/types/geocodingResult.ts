//Represnets the structure of the geocoding operation result.
export interface GeocodingResult {
  coords: [number, number];
  displayName: string; // Contains the name of the location
  properties?: {
    city?: string;
    state?: string;
    country?: string;
    [key: string]: any;
  };
}
