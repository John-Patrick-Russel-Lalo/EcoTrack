import { RouteIcon } from './icons';

export default function RouteChip({ route, onClick }) {
  if (!route) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-[1050] flex justify-center px-3">
      <button
        onClick={onClick}
        className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-float ring-1 ring-black/5 backdrop-blur"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-white">
          <RouteIcon className="h-4 w-4" />
        </span>
        {route.distance.toFixed(1)} km · {Math.round(route.time)} min · {route.bins} stop
        {route.bins === 1 ? '' : 's'}
      </button>
    </div>
  );
}
