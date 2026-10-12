import { Link } from 'react-router-dom';
import { useBins } from '../../context/BinsProvider';
import { STATUS_META, STATUS_ORDER } from '../../lib/constants';

export default function AboutPanel({ role }) {
  const { bins, connected } = useBins();
  const nextRole = role === 'driver' ? 'user' : 'driver';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="rounded-2xl bg-slate-50 p-3 text-center">
            <p className="text-lg font-bold" style={{ color: STATUS_META[status].color }}>
              {bins.filter((bin) => bin.status === status).length}
            </p>
            <p className="text-[11px] text-slate-400">{STATUS_META[status].label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
        <p className="flex justify-between">
          <span>Connection</span>
          <span className={connected ? 'font-semibold text-emerald-600' : 'text-slate-400'}>
            {connected ? 'Live' : 'Offline'}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Total bins</span>
          <span className="font-semibold text-slate-700">{bins.length}</span>
        </p>
      </div>

      <Link to={`/${nextRole}`} className="btn-secondary w-full">
        Switch to {nextRole === 'driver' ? 'driver' : 'resident'} app
      </Link>

      <p className="text-center text-[11px] text-slate-400">
        EcoTrack © {new Date().getFullYear()}
      </p>
    </div>
  );
}
