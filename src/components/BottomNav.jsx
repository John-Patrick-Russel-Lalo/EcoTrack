export default function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-stretch gap-1 rounded-2xl bg-white/95 p-1.5 shadow-float ring-1 ring-black/5 backdrop-blur">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${
                isActive ? 'bg-accent-soft text-accent' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
