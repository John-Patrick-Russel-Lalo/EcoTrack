const VARIANTS = {
  info: { ring: 'ring-slate-200', icon: 'text-slate-500', bg: 'bg-white' },
  success: { ring: 'ring-emerald-200', icon: 'text-emerald-500', bg: 'bg-white' },
  error: { ring: 'ring-red-200', icon: 'text-red-500', bg: 'bg-white' },
  warning: { ring: 'ring-amber-200', icon: 'text-amber-500', bg: 'bg-white' },
};

const ICONS = {
  info: 'M12 16v-4M12 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M20 6L9 17l-5-5',
  warning: 'M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  error: 'M18 6L6 18M6 6l12 12',
};

export default function Toasts({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[1200] flex flex-col items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      {toasts.map((toast) => {
        const variant = VARIANTS[toast.type] || VARIANTS.info;
        return (
          <button
            key={toast.id}
            onClick={() => onClose(toast.id)}
            className={`pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl px-4 py-3 text-left shadow-float ring-1 ${variant.bg} ${variant.ring}`}
          >
            <svg
              className={`mt-0.5 h-5 w-5 shrink-0 ${variant.icon}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={ICONS[toast.type] || ICONS.info} />
            </svg>
            <span className="min-w-0 flex-1">
              {toast.title && <span className="block text-sm font-semibold text-slate-800">{toast.title}</span>}
              {toast.message && <span className="block text-xs text-slate-500">{toast.message}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
