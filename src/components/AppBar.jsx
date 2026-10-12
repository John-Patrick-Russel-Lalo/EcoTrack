import { Link } from 'react-router-dom';
import { HomeIcon, PinIcon } from './icons';

export default function AppBar({ role, connected }) {
  const label = role === 'driver' ? 'Driver' : 'Resident';
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[900] px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 shadow-float ring-1 ring-black/5 backdrop-blur">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white">
          <PinIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-none text-slate-800">EcoTrack</p>
          <p className="text-[11px] text-slate-400">{label} app</p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {connected ? 'Live' : 'Offline'}
        </span>
        <Link
          to="/"
          aria-label="Back to role selection"
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <HomeIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
