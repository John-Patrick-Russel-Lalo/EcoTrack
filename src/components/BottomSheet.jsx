import { useEffect } from 'react';
import { CloseIcon } from './icons';

export default function BottomSheet({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center">
      <button
        aria-label="Close"
        onClick={() => onClose?.()}
        className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-[2px]"
      />
      <section
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg animate-sheet-in rounded-t-3xl bg-white shadow-sheet"
      >
        <div className="px-5 pt-3">
          <div className="sheet-handle" />
          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
            <button
              onClick={() => onClose?.()}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="safe-bottom border-t border-slate-100 px-5 pt-4">{footer}</div>}
      </section>
    </div>
  );
}
