import BottomSheet from './BottomSheet';
import { RouteIcon } from './icons';

export default function RouteSheet({ open, route, onClose, onClear, onOptimize }) {
  return (
    <BottomSheet
      open={open}
      title="Route information"
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <button type="button" onClick={onClear} className="btn-secondary flex-1">
            Clear route
          </button>
          <button type="button" onClick={onOptimize} className="btn-primary flex-1">
            Re-optimize
          </button>
        </div>
      }
    >
      {route ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-accent-soft p-3 text-accent">
            <RouteIcon className="h-6 w-6" />
            <p className="text-sm font-semibold">{route.label}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat value={`${route.distance.toFixed(1)}`} unit="km" label="Distance" />
            <Stat value={`${Math.round(route.time)}`} unit="min" label="Duration" />
            <Stat value={`${route.bins}`} unit="bins" label="Stops" />
          </div>
          <p className="text-center text-[11px] text-slate-400">
            Tap outside to hide this panel — your route stays on the map.
          </p>
        </div>
      ) : null}
    </BottomSheet>
  );
}

function Stat({ value, unit, label }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <p className="text-lg font-bold text-slate-800">
        {value}
        <span className="ml-1 text-xs font-medium text-slate-400">{unit}</span>
      </p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  );
}
