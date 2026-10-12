import { useBins } from '../../context/BinsProvider';
import { useGeo } from '../../context/GeoProvider';
import { useMap } from '../../context/MapProvider';
import { STATUS_META } from '../../lib/constants';
import { ChevronRightIcon, TrashIcon } from '../icons';

export default function BinsPanel({ onNavigate }) {
  const { bins, select, filter } = useBins();
  const { map, flyTo } = useMap();
  const { position } = useGeo();

  const visible = filter === 'full' ? bins.filter((bin) => bin.status === 'full') : bins;
  const sorted =
    position && map
      ? [...visible].sort(
          (a, b) =>
            map.distance(position, [a.latitude, a.longitude]) -
            map.distance(position, [b.latitude, b.longitude]),
        )
      : visible;

  if (bins.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
          <TrashIcon />
        </div>
        <p className="text-sm font-semibold text-slate-700">No bins yet</p>
        <p className="max-w-[16rem] text-xs text-slate-400">
          {filter === 'full'
            ? 'No full bins to show right now.'
            : 'Bins you and others add will appear here.'}
        </p>
      </div>
    );
  }

  function focusBin(bin) {
    select(bin.id);
    flyTo(bin.latitude, bin.longitude, 17);
    onNavigate?.('map');
  }

  return (
    <div className="space-y-2">
      {sorted.map((bin) => {
        const meta = STATUS_META[bin.status] || STATUS_META.empty;
        const distance =
          position && map ? map.distance(position, [bin.latitude, bin.longitude]) : null;
        return (
          <button
            key={bin.id}
            onClick={() => focusBin(bin)}
            className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left transition active:scale-[0.98]"
          >
            <span className="h-9 w-9 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-800">
                Bin #{bin.id} · {meta.label}
              </span>
              <span className="block truncate text-xs text-slate-400">
                {distance != null
                  ? distance < 1000
                    ? `${distance.toFixed(0)} m away`
                    : `${(distance / 1000).toFixed(2)} km away`
                  : `${bin.latitude.toFixed(4)}, ${bin.longitude.toFixed(4)}`}
              </span>
            </span>
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-300" />
          </button>
        );
      })}
    </div>
  );
}
