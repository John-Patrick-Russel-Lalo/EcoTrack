import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import RouteChip from '../components/RouteChip';
import RouteSheet from '../components/RouteSheet';
import StatusSheet from '../components/StatusSheet';
import AboutPanel from '../components/panels/AboutPanel';
import BinsPanel from '../components/panels/BinsPanel';
import DriverToolsPanel from '../components/panels/DriverToolsPanel';
import { InfoIcon, ListIcon, MapIcon, SlidersIcon } from '../components/icons';
import useDriverRoutes from '../hooks/useDriverRoutes';
import useRoleTheme from '../hooks/useRoleTheme';

export default function DriverApp() {
  useRoleTheme('driver');
  const routes = useDriverRoutes();
  const [routeSheetOpen, setRouteSheetOpen] = useState(false);

  useEffect(() => {
    if (routes.route) setRouteSheetOpen(true);
  }, [routes.route]);

  const tabs = useMemo(
    () => [
      { key: 'map', label: 'Map', icon: MapIcon },
      {
        key: 'bins',
        label: 'Bins',
        icon: ListIcon,
        title: 'Bins to collect',
        render: (goToTab) => <BinsPanel onNavigate={goToTab} />,
      },
      {
        key: 'tools',
        label: 'Tools',
        icon: SlidersIcon,
        title: 'Driver tools',
        render: (goToTab) => <DriverToolsPanel goToMap={() => goToTab('map')} routes={routes} />,
      },
      {
        key: 'about',
        label: 'About',
        icon: InfoIcon,
        title: 'About EcoTrack',
        render: () => <AboutPanel role="driver" />,
      },
    ],
    [routes],
  );

  return (
    <AppShell
      role="driver"
      tabs={tabs}
      overlays={
        <>
          <StatusSheet role="driver" />
          <RouteChip
            route={routeSheetOpen ? null : routes.route}
            onClick={() => setRouteSheetOpen(true)}
          />
          <RouteSheet
            open={Boolean(routes.route) && routeSheetOpen}
            route={routes.route}
            onClose={() => setRouteSheetOpen(false)}
            onClear={() => routes.clearRoute()}
            onOptimize={routes.optimizeRoute}
          />
        </>
      }
    />
  );
}
