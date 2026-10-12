import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const MapContext = createContext(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error('useMap must be used within MapProvider');
  return context;
}

export function MapProvider({ children }) {
  const [map, setMap] = useState(null);
  const [placement, setPlacement] = useState(false);

  const flyTo = useCallback(
    (lat, lng, zoom = 18) => {
      if (map) map.flyTo([lat, lng], zoom, { duration: 0.6 });
    },
    [map],
  );

  const value = useMemo(
    () => ({ map, setMap, placement, setPlacement, flyTo }),
    [map, placement, flyTo],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
