import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useBins } from '../context/BinsProvider';
import { useGeo } from '../context/GeoProvider';
import { useMap } from '../context/MapProvider';
import { useToast } from '../context/ToastProvider';

const ROUTE_STYLE = { color: 'rgb(var(--accent))', weight: 6, opacity: 0.85 };

export default function useDriverRoutes() {
  const { map } = useMap();
  const { bins, filter, setFilter, updateStatus } = useBins();
  const { position } = useGeo();
  const { show } = useToast();

  const routeRef = useRef(null);
  const [route, setRoute] = useState(null);

  const clearRoute = useCallback(
    (silent = false) => {
      if (routeRef.current && map) {
        map.removeControl(routeRef.current);
      }
      routeRef.current = null;
      setRoute(null);
      if (!silent) show({ type: 'info', title: 'Route cleared' });
    },
    [map, show],
  );

  useEffect(
    () => () => {
      if (routeRef.current && map) map.removeControl(routeRef.current);
    },
    [map],
  );

  const buildRoute = useCallback(
    (points, binCount, label, toastTitle) => {
      if (!map) return;
      if (routeRef.current) map.removeControl(routeRef.current);

      const control = L.Routing.control({
        waypoints: points.map(([lat, lng]) => L.latLng(lat, lng)),
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: { styles: [ROUTE_STYLE] },
      }).addTo(map);

      control.on('routesfound', (event) => {
        const summary = event.routes[0].summary;
        setRoute({
          distance: summary.totalDistance / 1000,
          time: summary.totalTime / 60,
          bins: binCount,
          label,
        });
      });

      routeRef.current = control;
      if (toastTitle) show({ type: 'success', title: toastTitle });
    },
    [map, show],
  );

  const requireLocation = useCallback(() => {
    if (!position) {
      show({ type: 'error', title: 'Enable location first', message: 'Tap "My location" to start tracking.' });
      return false;
    }
    return true;
  }, [position, show]);

  const findNearestBin = useCallback(() => {
    if (!requireLocation()) return;
    if (bins.length === 0) {
      show({ type: 'info', title: 'No bins available' });
      return;
    }
    let nearest = bins[0];
    let shortest = map.distance(position, [nearest.latitude, nearest.longitude]);
    bins.forEach((bin) => {
      const distance = map.distance(position, [bin.latitude, bin.longitude]);
      if (distance < shortest) {
        shortest = distance;
        nearest = bin;
      }
    });
    buildRoute(
      [position, [nearest.latitude, nearest.longitude]],
      1,
      'Nearest bin',
      'Route to nearest bin',
    );
  }, [bins, position, map, requireLocation, buildRoute, show]);

  const showFullBins = useCallback(() => {
    const fullBins = bins.filter((bin) => bin.status === 'full');
    if (fullBins.length === 0) {
      show({ type: 'info', title: 'No full bins', message: 'Every bin is below the full mark.' });
      return;
    }
    setFilter(filter === 'full' ? 'all' : 'full');
    show({
      type: 'success',
      title: filter === 'full' ? 'Showing all bins' : `Showing ${fullBins.length} full bin(s)`,
    });
  }, [bins, filter, setFilter, show]);

  const optimizeRoute = useCallback(() => {
    if (!requireLocation()) return;
    const targets = bins.filter((bin) => bin.status === 'full' || bin.status === 'half');
    if (targets.length === 0) {
      show({ type: 'info', title: 'Nothing to collect', message: 'No half or full bins right now.' });
      return;
    }

    const remaining = [...targets];
    const ordered = [];
    let cursor = position;
    while (remaining.length > 0) {
      let bestIndex = 0;
      let bestDistance = map.distance(cursor, [remaining[0].latitude, remaining[0].longitude]);
      remaining.forEach((bin, index) => {
        const distance = map.distance(cursor, [bin.latitude, bin.longitude]);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      const [next] = remaining.splice(bestIndex, 1);
      ordered.push(next);
      cursor = [next.latitude, next.longitude];
    }

    buildRoute(
      [position, ...ordered.map((bin) => [bin.latitude, bin.longitude])],
      ordered.length,
      'Optimized route',
      `Route optimized for ${ordered.length} bin(s)`,
    );
  }, [bins, position, map, requireLocation, buildRoute, show]);

  const markCollected = useCallback(
    (id) => {
      updateStatus(id, 'empty');
      show({ type: 'success', title: 'Bin collected', message: 'Marked as empty.' });
    },
    [updateStatus, show],
  );

  return { route, clearRoute, findNearestBin, showFullBins, optimizeRoute, markCollected };
}
