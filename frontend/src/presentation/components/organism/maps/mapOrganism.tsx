import 'leaflet/dist/leaflet.css';
import { UseMap } from '../../../hooks/maphook';
import { initializeMapUseCase } from '../../../../use-cases/maps/mapUseCase';
import { LeafletMapService } from '../../../../infrastructure/api/maps/leafletMapService';
import AddressSearch from '../../molecule/AdressSearch';

/**
 * Organism component that integrates the map interface with address searching logic.
 * * @returns A React functional component containing the search bar, the map, and coordinate display.
 */

const mapOrganism = () => {
  const mapID = 'lost-pet-map';
  const { coords } = UseMap(initializeMapUseCase, LeafletMapService, mapID); //Custom hookto handle the map initialization and coordinate state

  return (
    <div style={{ padding: '20px' }}>
      <h3>Selecciona la localizacion del perro perdido: </h3>
      {/* Search component to find specific locations by address */}
      <AddressSearch />

      {/* The map container where Leaflet will inject the interactive map */}
      <div
        id={mapID}
        style={{
          height: '450px',
          width: '100%',
          borderRadius: '12px',
          border: '2px solid #ccc',
          zIndex: 0,
          position: 'relative',
        }}
      />

      {/* Displays  the current coordinates centered on the map */}
      <p>
        Coordenadas seleccionadas: {coords[0]}, {coords[1]}{' '}
      </p>
    </div>
  );
};

export default mapOrganism;
