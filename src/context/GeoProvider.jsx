import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const GeoContext = createContext(null);

export function useGeo() {
  const context = useContext(GeoContext);
  if (!context) throw new Error('useGeo must be used within GeoProvider');
  return context;
}

export function GeoProvider({ children }) {
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const watchRef = useRef(null);
  const [requesting, setRequesting] = useState(false);

  const start = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device');
      return false;
    }
    if (watchRef.current != null) return true;

    setRequesting(true);
    setError(null);
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setTracking(true);
        setRequesting(false);
      },
      (err) => {
        setError(err.message || 'Unable to retrieve your location');
        setRequesting(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return true;
  }, []);

  const stop = useCallback(() => {
    if (watchRef.current != null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    setTracking(false);
  }, []);

  useEffect(
    () => () => {
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({ position, tracking, requesting, error, start, stop }),
    [position, tracking, requesting, error, start, stop],
  );

  return <GeoContext.Provider value={value}>{children}</GeoContext.Provider>;
}
