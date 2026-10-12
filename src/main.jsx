import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { BinsProvider } from './context/BinsProvider';
import { GeoProvider } from './context/GeoProvider';
import { MapProvider } from './context/MapProvider';
import { ToastProvider } from './context/ToastProvider';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ToastProvider>
      <BinsProvider>
        <GeoProvider>
          <MapProvider>
            <App />
          </MapProvider>
        </GeoProvider>
      </BinsProvider>
    </ToastProvider>
  </BrowserRouter>,
);
