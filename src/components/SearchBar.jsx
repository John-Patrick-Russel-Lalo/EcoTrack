import { useState } from 'react';
import { useMap } from '../context/MapProvider';
import { useToast } from '../context/ToastProvider';
import { searchPlace } from '../lib/nominatim';
import { SearchIcon } from './icons';

export default function SearchBar() {
  const { map } = useMap();
  const { show } = useToast();
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const query = value.trim();
    if (!query || !map) return;

    setBusy(true);
    try {
      const place = await searchPlace(query);
      if (!place) {
        show({ type: 'error', title: 'Not found', message: 'No place matched your search.' });
        return;
      }
      if (place.boundingbox) {
        const box = place.boundingbox.map(Number);
        map.fitBounds(
          [
            [box[0], box[2]],
            [box[1], box[3]],
          ],
          { padding: [40, 40], maxZoom: 18 },
        );
      } else {
        map.flyTo([parseFloat(place.lat), parseFloat(place.lon)], 17, { duration: 0.6 });
      }
    } catch {
      show({ type: 'error', title: 'Search failed', message: 'Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+4.75rem)] z-[900] px-3"
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-2 rounded-2xl bg-white/95 px-2 py-1.5 shadow-float ring-1 ring-black/5 backdrop-blur">
        <SearchIcon className="ml-1 h-5 w-5 shrink-0 text-slate-400" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search a location..."
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !value.trim()}
          className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-white transition disabled:opacity-40"
        >
          {busy ? '...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
