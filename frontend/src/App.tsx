import LandingPage from './presentation/pages/landing/LandingPage';
import { PaymentPage } from './features/payment/components/PaymentPage';
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
      <LandingPage />
    </div>
  );
}

export default App;
