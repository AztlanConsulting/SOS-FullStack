export interface ImapService {
  /**
   * Initializes the map instance and sets the initial view coordinates providing an optional move to callback.
   * @param coords A tuple representing [latitude and longitude].
   * @param elementId The ID of the HTML element where the map should be rendered.
   * @param onMove An optional callback triggered when the map center changes.
   */
  init(
    coords: [number, number],
    elementId: string,
    onMove?: (lat: number, lng: number) => void,
  ): void;

  /**
   * Adds a new marker to the map at the specific coordinates.
   * @param coords A tuple representing [latitude and longitude].
   */
  addMarker(coords: [number, number]): void;

  /**
   * Uses the fly effect to transition to the set of new coordinates
   * @param coords A tuple representing [latitude and longitude].
   */
  flyTo(coords: [number, number]): void;

  /**
   * Places or updates a specific marker on the map
   * @param coords A tuple representing [latitude and longitude].
   */
  placeMarker(coords: [number, number]): void;
}
