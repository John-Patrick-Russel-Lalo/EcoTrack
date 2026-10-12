import { useState } from 'react';
import { useBins } from '../context/BinsProvider';
import { useGeo } from '../context/GeoProvider';
import { useMap } from '../context/MapProvider';
import { useToast } from '../context/ToastProvider';
import { STATUS_META } from '../lib/constants';
import BottomSheet from './BottomSheet';
import StatusPicker from './StatusPicker';
import { TrashIcon } from './icons';

export default function StatusSheet({ role }) {
  const { selectedBin, clearSelection, updateStatus, deleteBin } = useBins();
  const { map } = useMap();
  const { position } = useGeo();
  const { show } = useToast();
  const [draft, setDraft] = useState({ id: null, status: null });

  if (!selectedBin) return null;

  const binId = selectedBin.id;
  const status = draft.id === binId ? draft.status : selectedBin.status;
  const meta = STATUS_META[status] || STATUS_META.empty;
  const distance =
    map && position ? map.distance(position, [selectedBin.latitude, selectedBin.longitude]) : null;

  function applyStatus(nextStatus) {
    updateStatus(binId, nextStatus);
    show({ type: 'success', title: 'Status updated', message: `Bin #${binId} is now ${STATUS_META[nextStatus].label.toLowerCase()}.` });
    clearSelection();
  }

  function handleDelete() {
    deleteBin(binId);
    show({ type: 'info', title: 'Bin removed', message: `Bin #${binId} was deleted.` });
    clearSelection();
  }

  const footer =
    role === 'driver' ? (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => applyStatus('empty')}
          disabled={status === 'empty'}
          className="btn-secondary flex-1"
        >
          <TrashIcon className="h-4 w-4" />
          Mark collected
        </button>
        <button
          type="button"
          onClick={() => applyStatus(status)}
          disabled={status === selectedBin.status}
          className="btn-primary flex-1"
        >
          Save status
        </button>
      </div>
    ) : (
      <div className="flex gap-2">
        <button type="button" onClick={handleDelete} className="btn-secondary flex-1 text-red-600">
          Delete
        </button>
        <button
          type="button"
          onClick={() => applyStatus(status)}
          disabled={status === selectedBin.status}
          className="btn-primary flex-1"
        >
          Update status
        </button>
      </div>
    );

  return (
    <BottomSheet open title={`Bin #${binId}`} onClose={clearSelection} footer={footer}>
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
        <span className="h-10 w-10 rounded-full" style={{ backgroundColor: meta.color }} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800">{meta.label}</p>
          <p className="truncate text-xs text-slate-500">
            {selectedBin.latitude.toFixed(5)}, {selectedBin.longitude.toFixed(5)}
            {distance != null && ` · ${distance < 1000 ? `${distance.toFixed(0)} m` : `${(distance / 1000).toFixed(2)} km`} away`}
          </p>
        </div>
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Set fill level</p>
      <StatusPicker value={status} onChange={(next) => setDraft({ id: binId, status: next })} />
    </BottomSheet>
  );
}
