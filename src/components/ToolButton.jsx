const TONES = {
  default: 'text-slate-500',
  accent: 'text-accent',
  danger: 'text-red-500',
};

export default function ToolButton({
  icon: Icon,
  label,
  description,
  onClick,
  tone = 'default',
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left transition active:scale-[0.98] disabled:opacity-40"
    >
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white ${TONES[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {description && <span className="block text-xs text-slate-400">{description}</span>}
      </span>
    </button>
  );
}
