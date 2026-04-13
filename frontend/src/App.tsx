import { ManualsListSection } from '@features/manuals/components/ManualsListSection';
import './App.css';
import { ManualsHeroSection } from '@features/manuals/components/ManualsHeroSection';

function App() {
  return (
    <div className="App">
      <ManualsHeroSection />
      <ManualsListSection />
    </div>
  );
}

export default App;
