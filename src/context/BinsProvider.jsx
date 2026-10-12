import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../lib/socket';

const BinsContext = createContext(null);

export function useBins() {
  const context = useContext(BinsContext);
  if (!context) throw new Error('useBins must be used within BinsProvider');
  return context;
}

export function BinsProvider({ children }) {
  const [bins, setBins] = useState(() => new Map());
  const [drivers, setDrivers] = useState(() => new Map());
  const [connected, setConnected] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    socket.connect();
    const offStatus = socket.onStatus((status) => setConnected(status === 'open'));
    const offMessage = socket.onMessage((data) => {
      if (data.type === 'driverlocation') {
        setDrivers((current) => new Map(current).set(data.id, data));
        return;
      }
      if (data.type === 'driverleave') {
        setDrivers((current) => {
          const nextDrivers = new Map(current);
          nextDrivers.delete(data.id);
          return nextDrivers;
        });
        return;
      }

      setBins((current) => {
        const next = new Map(current);
        switch (data.type) {
          case 'trashbin':
            next.set(data.id, data);
            break;
          case 'binstatus': {
            const bin = next.get(data.id);
            if (bin) next.set(data.id, { ...bin, status: data.status });
            break;
          }
          case 'editbin': {
            const bin = next.get(data.id);
            if (bin) next.set(data.id, { ...bin, ...data });
            break;
          }
          case 'deletebin':
            next.delete(data.id);
            break;
          default:
            break;
        }
        return next;
      });
    });
    return () => {
      offStatus();
      offMessage();
    };
  }, []);

  useEffect(() => {
    if (selectedId != null && !bins.has(selectedId)) {
      setSelectedId(null);
    }
  }, [bins, selectedId]);

  const value = useMemo(
    () => ({
      bins: Array.from(bins.values()),
      drivers: Array.from(drivers.values()),
      connected,
      filter,
      setFilter,
      selectedId,
      selectedBin: selectedId != null ? bins.get(selectedId) || null : null,
      select: setSelectedId,
      clearSelection: () => setSelectedId(null),
      addBin: (latitude, longitude) => socket.send({ type: 'trashbin', latitude, longitude }),
      updateStatus: (id, status) => socket.send({ type: 'updatebinstatus', id, status }),
      deleteBin: (id) => socket.send({ type: 'deletebin', id }),
      sendLocation: (latitude, longitude) => socket.send({ type: 'location', latitude, longitude }),
      sendDriverLocation: (latitude, longitude) =>
        socket.send({ type: 'driverlocation', latitude, longitude }),
    }),
    [bins, drivers, connected, filter, selectedId],
  );

  return <BinsContext.Provider value={value}>{children}</BinsContext.Provider>;
}
