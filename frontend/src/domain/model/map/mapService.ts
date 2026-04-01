export interface ImapService {
  init(coords: [number, number], elementId: string): void;
  addMarker(coords: [number, number]): void;
}
