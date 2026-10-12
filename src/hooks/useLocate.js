import { useCallback, useEffect } from 'react';
import { useGeo } from '../context/GeoProvider';
import { useMap } from '../context/MapProvider';
import { useToast } from '../context/ToastProvider';

export default function useLocate(send) {
  const { position, requesting, start, error } = useGeo();
  const { flyTo } = useMap();
  const { show } = useToast();

  useEffect(() => {
    if (position && send) send(position[0], position[1]);
  }, [position, send]);

  useEffect(() => {
    if (!error) return;
    show({ type: 'error', title: 'Location unavailable', message: error });
  }, [error, show]);

  const locate = useCallback(() => {
    if (position) {
      flyTo(position[0], position[1], 17);
      return;
    }
    if (requesting) return;
    start();
    show({
      type: 'info',
      title: 'Locating you',
      message: 'Allow location access to center the map on your position.',
    });
  }, [position, requesting, start, flyTo, show]);

  return { locate, position };
}
