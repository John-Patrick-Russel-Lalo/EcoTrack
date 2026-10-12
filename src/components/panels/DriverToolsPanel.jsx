import { useBins } from '../../context/BinsProvider';
import useLocate from '../../hooks/useLocate';
import ToolButton from '../ToolButton';
import { AlertIcon, CrosshairIcon, RouteIcon, SlidersIcon } from '../icons';

export default function DriverToolsPanel({ goToMap, routes }) {
  const { sendDriverLocation, filter } = useBins();
  const { locate } = useLocate(sendDriverLocation);

  function run(action) {
    goToMap?.();
    action();
  }

  return (
    <div className="space-y-2">
      <ToolButton
        icon={CrosshairIcon}
        label="My location"
        description="Center on your truck"
        onClick={locate}
      />
      <ToolButton
        icon={RouteIcon}
        tone="accent"
        label="Nearest bin"
        description="Build a route to the closest bin"
        onClick={() => run(routes.findNearestBin)}
      />
      <ToolButton
        icon={AlertIcon}
        label="Optimize route"
        description="Visit every half or full bin"
        onClick={() => run(routes.optimizeRoute)}
      />
      <ToolButton
        icon={SlidersIcon}
        label={filter === 'full' ? 'Show all bins' : 'Highlight full bins'}
        description="Emphasize bins that need pickup"
        onClick={routes.showFullBins}
      />
    </div>
  );
}
