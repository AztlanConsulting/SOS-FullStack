import * as L from 'leaflet';
import type { ImapService } from '../../../domain/model/map/mapService';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

//The default Leaflet marker icons.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

//Internal singleton that references the Map Instance
let map: L.Map | null = null;

//Implementation of the Map Service using the API of Leaflet
export const LeafletMapService: ImapService = {
  /**
   * Initializes the Leaflet map, with OpenStreetMap tile's and also re initializes if the map already exists
   * @param coords Initial Latitude and longitude center points.
   * @param elementId ID of the HTML container.
   * @param onMove Callback trigegred when the user finishes moving the map.
   * @returns
   */
  init(coords, elementId, onMove) {
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
  },

  /**
   * Adds a marker to the coordantes of the console.
   * @param coords Target Latitude and longitude.
   */

  addMarker(coords) {
    console.log('Marker placed at:', coords);
  },

  /**
   * Performs the fly animation to the target coordinates.
   * @param coords Latitude and longitude for the new marker position.
   */

  flyTo(coords) {
    map?.flyTo(coords, 16, { duration: 1.5 });
  },

  /**
   * Clears all existening markers and places one new marker
   * @param coords Latitude and longitude for the new marker position.
   */

  placeMarker(coords) {
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map?.removeLayer(layer);
    });
    L.marker(coords).addTo(map);
  },
};
