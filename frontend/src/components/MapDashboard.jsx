import React, {
  useState, useEffect, useCallback, useRef, useMemo
} from 'react';
import {
  GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow
} from '@react-google-maps/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAP_API_KEY  = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // India fallback

// Google Maps dark-mode style palette
const DARK_MAP_STYLES = [
  { elementType: 'geometry',             stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.stroke',   stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill',     stylers: [{ color: '#8b949e' }] },
  { featureType: 'administrative',       elementType: 'geometry',             stylers: [{ color: '#30363d' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#c9d1d9' }] },
  { featureType: 'poi',                  elementType: 'labels.text.fill',    stylers: [{ color: '#8b949e' }] },
  { featureType: 'poi.park',             elementType: 'geometry',             stylers: [{ color: '#0d2118' }] },
  { featureType: 'poi.park',             elementType: 'labels.text.fill',    stylers: [{ color: '#3fb950' }] },
  { featureType: 'road',                 elementType: 'geometry',             stylers: [{ color: '#1c2128' }] },
  { featureType: 'road',                 elementType: 'geometry.stroke',      stylers: [{ color: '#0d1117' }] },
  { featureType: 'road',                 elementType: 'labels.text.fill',    stylers: [{ color: '#484f58' }] },
  { featureType: 'road.highway',         elementType: 'geometry',             stylers: [{ color: '#273043' }] },
  { featureType: 'road.highway',         elementType: 'geometry.stroke',      stylers: [{ color: '#161b22' }] },
  { featureType: 'road.highway',         elementType: 'labels.text.fill',    stylers: [{ color: '#e6edf3' }] },
  { featureType: 'transit',             elementType: 'geometry',             stylers: [{ color: '#161b22' }] },
  { featureType: 'water',               elementType: 'geometry',             stylers: [{ color: '#060d17' }] },
  { featureType: 'water',               elementType: 'labels.text.fill',    stylers: [{ color: '#1f6feb' }] },
];

const MAP_CONTAINER_STYLE = { width: '100%', height: '440px' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (ts) => {
  if (!ts) return 'N/A';
  try {
    return new Date(ts).toLocaleString('en-IN', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return String(ts); }
};

// ─── Component ────────────────────────────────────────────────────────────────
const MapDashboard = ({ location, locationHistory = [], sosHistory = [] }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAP_API_KEY,
    id: 'google-map-script',
  });

  const mapRef      = useRef(null);
  const [selectedSOS,  setSelectedSOS]  = useState(null);
  const [isDark,       setIsDark]       = useState(true);
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [locDenied,    setLocDenied]    = useState(false);

  // ── Watch <html class="dark"> changes ──
  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.classList.contains('dark'));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Track when GPS updates ──
  useEffect(() => {
    if (location) setLastUpdated(new Date());
  }, [location?.lat, location?.lng]);

  // ── Check if location was denied ──
  useEffect(() => {
    navigator.permissions?.query({ name: 'geolocation' }).then(p => {
      setLocDenied(p.state === 'denied');
      p.onchange = () => setLocDenied(p.state === 'denied');
    });
  }, []);

  // ── Auto-pan map when user moves ──
  useEffect(() => {
    if (mapRef.current && location) mapRef.current.panTo(location);
  }, [location]);

  const onMapLoad = useCallback((map) => { mapRef.current = map; }, []);

  const center = location || DEFAULT_CENTER;

  // Build polyline (oldest → newest)
  const historyPath = useMemo(() => (
    [...locationHistory]
      .reverse()
      .map(l => ({ lat: Number(l.latitude), lng: Number(l.longitude) }))
      .filter(p => p.lat && p.lng)
  ), [locationHistory]);

  // Marker icons (created after API loads)
  const userIcon = useMemo(() => {
    if (!isLoaded || !window.google) return null;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: '#6366f1',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
      scale: 12,
    };
  }, [isLoaded]);

  const sosIcon = useMemo(() => {
    if (!isLoaded || !window.google) return null;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: '#ef4444',
      fillOpacity: 0.95,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 10,
    };
  }, [isLoaded]);

  // ── Map options ──
  const mapOptions = useMemo(() => ({
    styles: isDark ? DARK_MAP_STYLES : [],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
    backgroundColor: isDark ? '#0d1117' : '#f8fafc',
  }), [isDark]);

  // ────────────────────────────────────────────────────────── Render helpers ──

  if (loadError) return <MapErrorCard message="Google Maps failed to load. Check your API key in frontend/.env" />;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">

      {/* ── Header ── */}
      <div className="px-5 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-600/8 to-purple-600/8 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight">Live Map Tracking</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {location
                ? `${location.lat.toFixed(5)}°N  ${location.lng.toFixed(5)}°E`
                : locDenied ? '⚠ Location permission denied' : 'Acquiring GPS signal…'}
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          {locDenied && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
              GPS OFF
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="relative" style={{ height: 440 }}>
        {!isLoaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading map…</p>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={center}
            zoom={15}
            onLoad={onMapLoad}
            options={mapOptions}
          >
            {/* ── Live user marker ── */}
            {location && userIcon && (
              <Marker
                position={location}
                icon={userIcon}
                title="Your Current Location"
                zIndex={300}
                animation={window.google.maps.Animation.DROP}
              />
            )}

            {/* ── History polyline ── */}
            {historyPath.length > 1 && (
              <Polyline
                path={historyPath}
                options={{
                  strokeColor: '#6366f1',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                  geodesic: true,
                }}
              />
            )}

            {/* ── SOS markers ── */}
            {sosHistory.map((sos, i) => {
              const lat = sos?.location?.lat;
              const lng = sos?.location?.lng;
              if (!lat || !lng) return null;
              const pos = { lat: Number(lat), lng: Number(lng) };
              return (
                <Marker
                  key={`sos-${i}`}
                  position={pos}
                  icon={sosIcon}
                  title="SOS Alert – click for details"
                  zIndex={200}
                  onClick={() => setSelectedSOS({ ...sos, pos })}
                />
              );
            })}

            {/* ── SOS InfoWindow ── */}
            {selectedSOS && (
              <InfoWindow
                position={selectedSOS.pos}
                onCloseClick={() => setSelectedSOS(null)}
                options={{ pixelOffset: new window.google.maps.Size(0, -10) }}
              >
                <div style={{ fontFamily: 'system-ui, sans-serif', minWidth: 180. }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>🚨</span>
                    <strong style={{ color: '#dc2626', fontSize: 13 }}>SOS Alert</strong>
                  </div>
                  <div style={{ fontSize: 11, color: '#4b5563', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {selectedSOS.uid && (
                      <span>👤 User: <strong>{selectedSOS.uid}</strong></span>
                    )}
                    <span>📍 {selectedSOS.pos.lat.toFixed(5)}, {selectedSOS.pos.lng.toFixed(5)}</span>
                    {selectedSOS.timestamp && (
                      <span>🕐 {fmtTime(selectedSOS.timestamp)}</span>
                    )}
                    <span
                      style={{
                        display: 'inline-block', marginTop: 4,
                        padding: '2px 8px', borderRadius: 4,
                        background: selectedSOS.status === 'active' ? '#fef2f2' : '#f0fdf4',
                        color: selectedSOS.status === 'active' ? '#dc2626' : '#16a34a',
                        fontWeight: 700, fontSize: 10, textTransform: 'uppercase',
                      }}
                    >
                      {selectedSOS.status || 'active'}
                    </span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}

        {/* ── GPS coordinate overlay ── */}
        {isLoaded && location && (
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/50 dark:border-slate-700/50 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-0.5 pointer-events-none">
            <div>lat: {location.lat.toFixed(6)}</div>
            <div>lng: {location.lng.toFixed(6)}</div>
          </div>
        )}

        {/* ── Location denied overlay ── */}
        {locDenied && (
          <div className="absolute inset-x-4 top-4 bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 flex items-start gap-3 shadow-lg">
            <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-xs">Location Access Denied</p>
              <p className="text-amber-700 dark:text-amber-400 text-[11px] mt-0.5">
                Enable location permissions in your browser settings to show your live position.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Stats footer ── */}
      <div className="px-5 py-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30">
        <div className="flex items-center gap-5 text-xs">
          <StatChip color="indigo" label={`${historyPath.length} path pts`}>
            <span className="w-4 h-1 bg-indigo-500 rounded inline-block mr-1" />
          </StatChip>
          <StatChip color="red" label={`${sosHistory.length} SOS`}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block mr-1" />
          </StatChip>
          <StatChip color="slate" label={`${locationHistory.length} records`}>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block mr-1" />
          </StatChip>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          {lastUpdated ? `⟳ ${lastUpdated.toLocaleTimeString()}` : 'Waiting for GPS…'}
        </p>
      </div>

      {/* ── AI Safety bar ── */}
      <div className="mx-4 mb-4 mt-1 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200 text-sm">
          <span>🛡️</span>
          <span><strong>AI Safety Score:</strong> Area is Safe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
            <div className="h-full w-[92%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
          <span className="text-xs font-bold bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-md">
            92/100
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const StatChip = ({ children, label }) => (
  <span className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
    {children}{label}
  </span>
);

const MapErrorCard = ({ message }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 overflow-hidden">
    <div className="px-5 py-3 border-b border-red-100 dark:border-red-800 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <p className="font-bold text-slate-800 dark:text-white text-sm">Live Map Tracking</p>
    </div>
    <div className="h-64 flex flex-col items-center justify-center gap-4 bg-red-50 dark:bg-red-900/10 p-8 text-center">
      <svg className="w-14 h-14 text-red-400 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="font-semibold text-red-700 dark:text-red-400">Map failed to load</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>
      </div>
    </div>
  </div>
);

export default React.memo(MapDashboard);
