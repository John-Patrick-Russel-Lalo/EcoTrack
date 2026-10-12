import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useBins } from '../context/BinsProvider';
import { useGeo } from '../context/GeoProvider';
import { useMap } from '../context/MapProvider';
import { useToast } from '../context/ToastProvider';
import { CAMPUS, STATUS_META } from '../lib/constants';

function binIcon(status) {
  const meta = STATUS_META[status] || STATUS_META.empty;
  return L.divIcon({
    className: 'bin-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
    html: `
      <div style="width:34px;height:34px;display:grid;place-items:center;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${meta.color};border:2px solid #fff;box-shadow:0 6px 14px -4px rgba(15,23,42,.6)">
        <svg viewBox="0 0 24 24" width="16" height="16" style="transform:rotate(45deg)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
        </svg>
      </div>`,
  });
}

function campusIcon() {
  return L.divIcon({
    className: 'bin-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
    html: `
      <div style="width:34px;height:34px;display:grid;place-items:center;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#0f172a;border:2px solid #fff;box-shadow:0 6px 14px -4px rgba(15,23,42,.6)">
        <svg viewBox="0 0 24 24" width="16" height="16" style="transform:rotate(45deg)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>`,
  });
}

function userIcon(role) {
  if (role === 'driver') {
    return L.divIcon({
      className: 'bin-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
      html: `
        <div style="width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:rgb(var(--accent));border:3px solid #fff;box-shadow:0 6px 14px -4px rgba(15,23,42,.6)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 4h14v11H1zM15 8h4l3 3v4h-7" />
            <circle cx="5.5" cy="18" r="2" />
            <circle cx="17.5" cy="18" r="2" />
          </svg>
        </div>`,
    });
  }
  return L.icon({
    iconUrl: '/pinUser.png',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

function driverIcon() {
  return L.divIcon({
    className: 'bin-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `
      <div style="width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:#0f172a;border:3px solid #fff;box-shadow:0 6px 14px -4px rgba(15,23,42,.6)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 4h14v11H1zM15 8h4l3 3v4h-7" />
          <circle cx="5.5" cy="18" r="2" />
          <circle cx="17.5" cy="18" r="2" />
        </svg>
      </div>`,
  });
}

export default function MapView({ role = 'user' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const binsLayerRef = useRef(null);
  const driversLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const { map, setMap, placement, setPlacement } = useMap();
  const { bins, drivers, select, addBin, filter } = useBins();
  const { position } = useGeo();
  const { show } = useToast();

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return undefined;

    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap contributors',
    });
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 20, attribution: '&copy; Esri' },
    );
    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; CartoDB',
    });
    const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; CartoDB',
    });

    const map = L.map(containerRef.current, {
      center: [CAMPUS.lat, CAMPUS.lng],
      zoom: 14,
      zoomControl: false,
      layers: [streets],
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control
      .layers(
        { Streets: streets, Satellite: satellite, Dark: dark, Light: light },
        undefined,
        { position: 'topright' },
      )
      .addTo(map);

    L.marker([CAMPUS.lat, CAMPUS.lng], { icon: campusIcon() })
      .addTo(map)
      .bindPopup(`<b>${CAMPUS.label}</b>`);

    mapRef.current = map;
    setMap(map);

    return () => {
      map.remove();
      mapRef.current = null;
      setMap(null);
    };
  }, [setMap]);

  useEffect(() => {
    if (binsLayerRef.current) {
      binsLayerRef.current.remove();
      binsLayerRef.current = null;
    }
    if (driversLayerRef.current) {
      driversLayerRef.current.remove();
      driversLayerRef.current = null;
    }
    if (userMarkerRef.current) {
      userMarkerRef.current = null;
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;
    if (!binsLayerRef.current) {
      binsLayerRef.current = L.layerGroup().addTo(map);
    }
    const layer = binsLayerRef.current;
    layer.clearLayers();
    bins.forEach((bin) => {
      const marker = L.marker([bin.latitude, bin.longitude], { icon: binIcon(bin.status) });
      marker.on('click', (event) => {
        L.DomEvent.stopPropagation(event);
        select(bin.id);
      });
      marker.addTo(layer);
      if (filter === 'full' && bin.status !== 'full') {
        marker.setOpacity(0.25);
      }
    });
  }, [map, bins, select, filter]);

  useEffect(() => {
    if (!map) return;
    if (!driversLayerRef.current) {
      driversLayerRef.current = L.layerGroup().addTo(map);
    }
    const layer = driversLayerRef.current;
    layer.clearLayers();
    if (role === 'user') {
      drivers.forEach((driver) => {
        L.marker([driver.latitude, driver.longitude], { icon: driverIcon() })
          .addTo(layer)
          .bindPopup('<b>Garbage truck</b><br>Live location');
      });
    }
  }, [map, drivers, role]);

  useEffect(() => {
    if (!map || !position) return;
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(position, { icon: userIcon(role) })
        .addTo(map)
        .bindPopup(role === 'driver' ? 'Your truck location' : 'You are here!');
    } else {
      userMarkerRef.current.setLatLng(position);
    }
  }, [map, position, role]);

  useEffect(() => {
    if (!map) return undefined;
    const handleClick = (event) => {
      if (!placement) return;
      addBin(event.latlng.lat, event.latlng.lng);
      setPlacement(false);
      show({ title: 'Bin placed', message: 'A new garbage bin was added.', type: 'success' });
    };
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, placement, addBin, setPlacement, show]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.style.cursor = placement ? 'crosshair' : '';
  }, [placement]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
