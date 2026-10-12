import { STATUS_META, STATUS_ORDER } from '../lib/constants';

export default function StatusPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        const selected = value === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            style={{ backgroundColor: meta.soft, color: meta.color }}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition ${
              selected ? 'border-current' : 'border-transparent'
            }`}
          >
            <span className="h-7 w-7 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="text-xs font-semibold">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
