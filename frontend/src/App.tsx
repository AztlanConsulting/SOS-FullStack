import { useState, useEffect } from 'react';
import { PaymentPage } from './features/payment/components/PaymentPage';
import { ReportConfirmationPage } from './pages/ReportConfirmation';
import { PetReportProvider } from './features/users/context/PetReportContext';
import { PhotonGeocoding } from '@features/map/services/photonGeocodingService';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'confirmation' | 'payment'>(
    'confirmation',
  );

  useEffect(() => {
    PhotonGeocoding.search('init').catch(() => {});
  }, []);

  return (
    <PetReportProvider>
      <div className="App">
        {currentView === 'confirmation' && (
          <ReportConfirmationPage
            onNavigateToPayment={() => setCurrentView('payment')}
          />
        )}

        {currentView === 'payment' && (
          <div>
            <button
              onClick={() => setCurrentView('confirmation')}
              className="mb-4 text-blue-500 underline"
            >
              &larr; Regresar a Confirmación
            </button>
            <PaymentPage />
          </div>
        )}
      </div>
    </PetReportProvider>
  );
}

export default App;
