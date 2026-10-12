import { useState } from 'react';
import { STATUS_META, STATUS_ORDER } from '../lib/constants';
import { LayersIcon } from './icons';

export default function Legend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] left-3 z-[900]">
      <div className="pointer-events-auto overflow-hidden rounded-2xl bg-white/95 shadow-float ring-1 ring-black/5 backdrop-blur">
        <button
          onClick={() => setOpen((current) => !current)}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600"
        >
          <LayersIcon className="h-4 w-4 text-slate-400" />
          Bin status
        </button>
        {open && (
          <div className="animate-fade-in space-y-2 border-t border-slate-100 px-3 py-2">
            {STATUS_ORDER.map((status) => (
              <div key={status} className="flex items-center gap-2 text-xs text-slate-500">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_META[status].color }}
                />
                {STATUS_META[status].label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
