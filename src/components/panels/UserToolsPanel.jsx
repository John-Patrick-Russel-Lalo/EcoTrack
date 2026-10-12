import { useBins } from '../../context/BinsProvider';
import { useMap } from '../../context/MapProvider';
import { useToast } from '../../context/ToastProvider';
import useLocate from '../../hooks/useLocate';
import ToolButton from '../ToolButton';
import { CrosshairIcon, LayersIcon, PlusIcon } from '../icons';

export default function UserToolsPanel({ onNavigate }) {
  const { sendLocation, filter, setFilter } = useBins();
  const { placement, setPlacement } = useMap();
  const { show } = useToast();
  const { locate } = useLocate(sendLocation);

  function startPlacement() {
    onNavigate?.('map');
    setPlacement(true);
    show({ type: 'info', title: 'Place a bin', message: 'Tap anywhere on the map to drop it.' });
  }

  return (
    <div className="space-y-2">
      <ToolButton
        icon={PlusIcon}
        tone="accent"
        label={placement ? 'Placing...' : 'Add garbage bin'}
        description="Drop a new bin on the map"
        onClick={startPlacement}
      />
      <ToolButton
        icon={CrosshairIcon}
        label="My location"
        description="Center the map on your position"
        onClick={locate}
      />
      <ToolButton
        icon={LayersIcon}
        label={filter === 'full' ? 'Show all bins' : 'Show full bins'}
        description="Filter bins by fill level"
        onClick={() => setFilter(filter === 'full' ? 'all' : 'full')}
      />
    </div>
  );
}
