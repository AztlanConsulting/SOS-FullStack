import * as L from 'leaflet';
import markerIcon from '@assets/images/markerIcon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

//The default Leaflet marker icons.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  className: 'custom-pin-border',
  iconSize: [35, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

//Internal singleton that references the Map Instance
let map: L.Map | null = null;
let marker: L.Marker | null = null;
const markerMoveListeners = new Set<(coords: [number, number]) => void>();

function emitMarkerMove(coords: [number, number]) {
  markerMoveListeners.forEach((listener) => listener(coords));
}

//Implementation of the Map Service using the API of Leaflet
export const LeafletMapService = {
  /**
   * Initializes the Leaflet map, with OpenStreetMap tile's and also re initializes if the map already exists
   * @param coords Initial Latitude and longitude center points.
   * @param elementId ID of the HTML container.
   * @param onMove Callback trigegred when the user finishes moving the map.
   * @returns
   */
  init(
    coords: [number, number],
    elementId: string,
    onMove?: (lat: number, lng: number) => void,
    onClick?: (lat: number, lng: number) => void,
  ) {
    if (map) return;

    //Container state to prevent "Map container is already initialized" errors.
    const container = L.DomUtil.get(elementId);
    if (container) {
      (container as any)._leaflet_id = null;
    }

    map = L.map(elementId, {
      dragging: true,
      scrollWheelZoom: true,
    }).setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    //Ensures that the map tiles are properly aligned.
    setTimeout(() => map?.invalidateSize(), 0);

    if (onMove) {
      map.on('moveend', () => {
        const center = map!.getCenter();
        onMove(center.lat, center.lng);
      });
    }

    map.on('click', (event: L.LeafletMouseEvent) => {
      const clickedCoords: [number, number] = [
        event.latlng.lat,
        event.latlng.lng,
      ];
      this.placeMarker(clickedCoords);
    });
  },

  /**
   * Adds a marker to the coordantes of the console.
   * @param coords Target Latitude and longitude.
   */

  addMarker(coords: [number, number]) {
    console.log('Marker placed at:', coords);
  },

  /**
   * Performs the fly animation to the target coordinates.
   * @param coords Latitude and longitude for the new marker position.
   */

  flyTo(coords: [number, number]) {
    map?.flyTo(coords, 16, { duration: 1.5 });
  },

  /**
   * Clears all existening markers and places one new marker
   * @param coords Latitude and longitude for the new marker position.
   */

  placeMarker(coords: [number, number], emitChange = true) {
    if (!map) return;

    if (!marker) {
      marker = L.marker(coords, { draggable: true }).addTo(map);

      marker.on('dragend', () => {
        const currentCoords = marker!.getLatLng();
        const draggedCoords: [number, number] = [
          currentCoords.lat,
          currentCoords.lng,
        ];
        emitMarkerMove(draggedCoords);
      });
    } else {
      marker.setLatLng(coords);
    }

    if (emitChange) {
      emitMarkerMove(coords);
    }
  },

  onMarkerMove(listener: (coords: [number, number]) => void) {
    markerMoveListeners.add(listener);

    return () => {
      markerMoveListeners.delete(listener);
    };
  },

  /**
   * Destroy the actual instance of the map and clears the memory
   * @param mapID ID of the HTML container.
   */
  destroyMap(mapID: string) {
    if (map) {
      map.remove();
      map = null;
    }
    marker = null;
    markerMoveListeners.clear();
    const container = L.DomUtil.get(mapID);
    if (container) {
      (container as HTMLElement & { _leaflet_id?: null })._leaflet_id = null;
    }
  },

  /**
   * Destroy the actual instance of the map and clears the memory
   * @param mapID ID of the HTML container.
   */
  destroyMap(mapID: string) {
    if (map) {
      map.remove();
      map = null;
    }
    const container = L.DomUtil.get(mapID);
    if (container) {
      (container as HTMLElement & { _leaflet_id?: null })._leaflet_id = null;
    }
  },
};
