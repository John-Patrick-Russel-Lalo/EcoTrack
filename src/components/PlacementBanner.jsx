export default function PlacementBanner({ onCancel }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-[1050] flex justify-center px-3">
      <button
        onClick={onCancel}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-xs font-medium text-white shadow-float"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Tap the map to place a bin · Cancel
      </button>
    </div>
  );
}
