import React from 'react';
import 'leaflet/dist/leaflet.css';
import { UseMap } from '../../../hooks/maphook';
import { initializeMapUseCase } from '../../../../use-cases/maps/mapUseCase';
import { LeafletMapService } from '../../../../infraestructure/maps/leafletMapService';

const mapOrganism = () => {
  const mapID = 'lost-pet-map';
  const { coords } = UseMap(initializeMapUseCase, LeafletMapService, mapID);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Selecciona la localizacion del perro perdido: </h3>

      <div
        id={mapID}
        style={{
          height: '450px',
          width: '100%',
          borderRadius: '12px',
          border: '2px solid #ccc',
        }}
      />

      <p>
        Coordenadas seleccionadas: {coords[0]}, {coords[1]}{' '}
      </p>
    </div>
  );
};

export default mapOrganism;
