import { ChevronDownIcon } from './icons';

export default function Panel({ title, onClose, children }) {
  return (
    <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-[950] px-3">
      <div className="mx-auto w-full max-w-lg animate-sheet-in overflow-hidden rounded-3xl bg-white shadow-float ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[42vh] overflow-y-auto p-3">{children}</div>
      </div>
    </div>
  );
}
