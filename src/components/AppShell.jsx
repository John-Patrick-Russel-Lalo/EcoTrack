import { useState } from 'react';
import { useBins } from '../context/BinsProvider';
import { useMap } from '../context/MapProvider';
import AppBar from './AppBar';
import BottomNav from './BottomNav';
import Legend from './Legend';
import MapView from './MapView';
import Panel from './Panel';
import PlacementBanner from './PlacementBanner';
import SearchBar from './SearchBar';

export default function AppShell({ role, tabs, overlays }) {
  const [active, setActive] = useState('map');
  const { connected } = useBins();
  const { placement, setPlacement } = useMap();

  const activeTab = tabs.find((tab) => tab.key === active);
  const showPanel = activeTab && active !== 'map' && typeof activeTab.render === 'function';

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200">
      <MapView role={role} />
      <AppBar role={role} connected={connected} />
      <SearchBar />
      <Legend />
      {placement && <PlacementBanner onCancel={() => setPlacement(false)} />}
      {showPanel && (
        <Panel title={activeTab.title} onClose={() => setActive('map')}>
          {activeTab.render(setActive)}
        </Panel>
      )}
      <BottomNav tabs={tabs} active={active} onChange={setActive} />
      {overlays}
    </div>
  );
}
