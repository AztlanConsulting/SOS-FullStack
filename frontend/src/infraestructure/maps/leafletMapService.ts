import type { ImapService } from '../../domain/model/map/mapService';
import * as L from 'leaflet';

export const LeafletMapService: ImapService = {
  init(coords, elementId) {
    const container = L.DomUtil.get(elementId);
    if (container) {
      (container as any)._leaflet_id = null;
    }

    const map = L.map(elementId).setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  },

  addMarker(coords) {
    console.log('Marker placed at:', coords);
  },
};
