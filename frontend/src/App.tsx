import { useEffect } from 'react';
import MapOrganism from '@features/map/components/MapOrganism';
import { PhotonGeocoding } from '@features/map/services/photonGeocodingService';
import './App.css';

function App() {
  useEffect(() => {
    // Warm-up request for improved performance
    PhotonGeocoding.search('init').catch(() => {});
  }, []);

  return (
    <div className="App">
      <h1>SOS FullStack</h1>
      <p>Welcome to the SOS-FullStack-feature-react project!</p>
      <MapOrganism />
    </div>
  );
}

export default App;
