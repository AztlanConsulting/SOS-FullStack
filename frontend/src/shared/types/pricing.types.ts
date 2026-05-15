/**
 * Represents an individual product (Plan, Manual, or Workshop)
 * with its price converted to the user's local currency.
 */
export interface LocalizedItem {
  name: string;
  originalPrice: number;
  localizedPrice: number;
  currencyCode: string;
  exchangeRate: number;
}

/**
 * The final payload sent to the client-side Pricing Page.
 * It provides context about the detected location and the categorized
 * list of all available offerings with localized costs.
 */
export interface PricingData {
  country: string | null;
  currencyCode: string;
  plans: LocalizedItem[];
  manuals: LocalizedItem[];
  workshops: LocalizedItem[];
}
