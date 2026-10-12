import { Link } from 'react-router-dom';
import useRoleTheme from '../hooks/useRoleTheme';
import { ChevronRightIcon, PinIcon, TrashIcon, TruckIcon } from '../components/icons';

function RoleCard({ to, icon: Icon, title, description, tone }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 group-hover:border-amber-200',
  };
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-3xl border-2 border-transparent bg-white p-4 shadow-float transition active:scale-[0.99]"
    >
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-slate-800">{title}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />
    </Link>
  );
}

export default function Home() {
  useRoleTheme('user');

  return (
    <div className="flex min-h-full flex-col justify-between gap-8 bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+3rem)]">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-600 text-white shadow-float">
          <PinIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to EcoTrack</h1>
          <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">
            Real-time waste collection tracking for your community.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-md space-y-3">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Choose your role
        </p>
        <RoleCard
          to="/user"
          icon={TrashIcon}
          title="Resident"
          description="Report and track bin fill levels around you."
          tone="emerald"
        />
        <RoleCard
          to="/driver"
          icon={TruckIcon}
          title="Garbage truck driver"
          description="Find, route, and collect the fullest bins."
          tone="amber"
        />
      </div>

      <p className="text-center text-[11px] text-slate-400">EcoTrack © {new Date().getFullYear()}</p>
    </div>
  );
}
