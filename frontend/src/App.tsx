import { useEffect } from 'react';
import { PhotonGeocoding } from '@features/map/services/photonGeocodingService';
import './App.css';
import { RouterProvider } from 'react-router';
import router from '@routes/router';

function App() {
  useEffect(() => {
    // Warm-up request for improved performance
    PhotonGeocoding.search('init').catch(() => {});
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
