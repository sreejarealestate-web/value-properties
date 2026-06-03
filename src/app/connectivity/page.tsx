'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { locations } from '@/data/locations'
import { Clock, Navigation, Layers, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const DESTINATIONS = [
  'BKC', 'Nariman Point', 'Airport (Chhatrapati Shivaji)', 'Navi Mumbai CBD',
  'Borivali', 'Thane', 'Panvel', 'Pune (Expressway)',
  'Powai', 'Andheri', 'Dadar', 'CSMT (CST)', 'Bandra Station',
]

const INFRASTRUCTURE = [
  { id: 'coastal-road', label: 'Mumbai Coastal Road', status: 'Operational', year: '2024', color: '#059669' },
  { id: 'bwsl', label: 'Bandra-Worli Sea Link', status: 'Operational', year: '2009', color: '#059669' },
  { id: 'atal-setu', label: 'Atal Setu (Trans Harbour Link)', status: 'Operational', year: '2024', color: '#059669' },
  { id: 'metro-3', label: 'Metro Line 3 (Aqua Line)', status: 'Operational', year: '2024', color: '#059669' },
  { id: 'eastern-freeway', label: 'Eastern Freeway', status: 'Operational', year: '2013', color: '#059669' },
  { id: 'coastal-north', label: 'Coastal Road North Extension', status: 'Under Construction', year: '2026', color: '#EA580C' },
  { id: 'worli-sewri', label: 'Worli–Sewri Elevated Connector', status: 'Under Construction', year: '2026', color: '#EA580C' },
  { id: 'orange-gate', label: 'Orange Gate – Marine Drive Tunnel', status: 'Under Construction', year: '2026', color: '#EA580C' },
  { id: 'metro-11', label: 'Metro Line 11 (Wadala–CSMT)', status: 'Under Construction', year: '2027', color: '#EA580C' },
  { id: 'thane-borivali', label: 'Thane–Borivali Twin Tunnel', status: 'Under Construction', year: '2027', color: '#EA580C' },
  { id: 'bullet-train', label: 'Mumbai–Ahmedabad Bullet Train', status: 'Under Construction', year: '2028', color: '#EA580C' },
  { id: 'bvsl', label: 'Bandra–Versova Sea Link', status: 'Proposed', year: '2027', color: '#2563EB' },
  { id: 'bkc-airport', label: 'Worli–BKC–Airport Tunnel', status: 'Proposed', year: '2029', color: '#2563EB' },
]

const TIMELINE = ['Current', '2025', '2026', '2027', '2028+']

const TRAVEL_DATA: Record<string, { drive: string; peak: string; distance: string }> = {
  'BKC': { drive: '12–15 min', peak: '20–35 min', distance: '8.5 km' },
  'Nariman Point': { drive: '15–20 min', peak: '25–40 min', distance: '9.2 km' },
  'Airport (Chhatrapati Shivaji)': { drive: '25–35 min', peak: '40–60 min', distance: '18 km' },
  'Navi Mumbai CBD': { drive: '30–40 min', peak: '45–65 min', distance: '25 km' },
  'Borivali': { drive: '45–55 min', peak: '70–90 min', distance: '38 km' },
  'Thane': { drive: '40–50 min', peak: '60–80 min', distance: '30 km' },
  'Panvel': { drive: '50–65 min', peak: '75–95 min', distance: '42 km' },
  'Pune (Expressway)': { drive: '2.5–3 hr', peak: '3–4 hr', distance: '155 km' },
  'Powai': { drive: '35–45 min', peak: '55–75 min', distance: '25 km' },
  'Andheri': { drive: '30–40 min', peak: '50–70 min', distance: '22 km' },
  'Dadar': { drive: '10–15 min', peak: '18–25 min', distance: '5.8 km' },
  'CSMT (CST)': { drive: '20–25 min', peak: '30–45 min', distance: '14 km' },
  'Bandra Station': { drive: '15–20 min', peak: '25–40 min', distance: '10 km' },
}

const DESTINATION_COORDS: Record<string, [number, number]> = {
  'BKC': [19.0650, 72.8651],
  'Nariman Point': [18.9256, 72.8242],
  'Airport (Chhatrapati Shivaji)': [19.0896, 72.8656],
  'Navi Mumbai CBD': [19.0368, 73.0158],
  'Borivali': [19.2307, 72.8567],
  'Thane': [19.2183, 72.9781],
  'Panvel': [18.9894, 73.1175],
  'Pune (Expressway)': [18.5204, 73.8567],
  'Powai': [19.1176, 72.9060],
  'Andheri': [19.1136, 72.8697],
  'Dadar': [19.0178, 72.8478],
  'CSMT (CST)': [18.9398, 72.8354],
  'Bandra Station': [19.0544, 72.8402],
}

// Road classification → color + label
function classifyRoad(name: string): { color: string; weight: number; label: string } {
  const n = (name || '').toLowerCase()
  if (n.includes('sea link') || n.includes('bandra-worli') || n.includes('bandra–worli') || n.includes('rajiv gandhi'))
    return { color: '#B8973B', weight: 5, label: 'Bandra-Worli Sea Link' }
  if (n.includes('coastal road') || n.includes('coastal'))
    return { color: '#059669', weight: 5, label: 'Mumbai Coastal Road' }
  if (n.includes('eastern freeway') || n.includes('eastern express'))
    return { color: '#7C3AED', weight: 5, label: 'Eastern Freeway' }
  if (n.includes('western express') || n.includes('western highway') || n.includes('sv road') || n.includes('s.v. road'))
    return { color: '#2563EB', weight: 4, label: 'Western Express Highway' }
  if (n.includes('atal setu') || n.includes('trans harbour') || n.includes('nhava'))
    return { color: '#DC2626', weight: 5, label: 'Atal Setu' }
  if (n.includes('expressway') || n.includes('national highway') || n.includes('nh'))
    return { color: '#EA580C', weight: 4, label: 'Expressway / NH' }
  if (n.includes('flyover') || n.includes('bridge') || n.includes('elevated'))
    return { color: '#8B5CF6', weight: 4, label: 'Elevated Road / Flyover' }
  return { color: '#94A3B8', weight: 3, label: 'Local Road' }
}

const ROAD_LEGEND = [
  { color: '#B8973B', label: 'Bandra-Worli Sea Link' },
  { color: '#059669', label: 'Mumbai Coastal Road' },
  { color: '#7C3AED', label: 'Eastern Freeway' },
  { color: '#2563EB', label: 'Expressway / NH' },
  { color: '#DC2626', label: 'Atal Setu' },
  { color: '#8B5CF6', label: 'Elevated / Flyover' },
  { color: '#94A3B8', label: 'Local Roads' },
]

interface RouteStep {
  name: string
  coords: [number, number][]
  classification: ReturnType<typeof classifyRoad>
}

function ConnectivityMap({
  fromCoords, toCoords, fromLabel, toLabel, onRouteLoaded,
}: {
  fromCoords: [number, number]
  toCoords: [number, number]
  fromLabel: string
  toLabel: string
  onRouteLoaded?: (steps: RouteStep[], usedInfra: string[]) => void
}) {
  const mapRef = useRef<any>(null)
  const layersRef = useRef<any[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const drawRoute = useCallback(async () => {
    const L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')

    if (!mapRef.current) {
      const map = L.map('connectivity-map', {
        center: [19.05, 72.87],
        zoom: 11,
        zoomControl: false,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'topright' }).addTo(map)
    }

    const map = mapRef.current

    // Clear old layers
    layersRef.current.forEach(l => l.remove())
    layersRef.current = []

    setStatus('loading')

    try {
      // Fetch actual route from OSRM public API
      const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?steps=true&geometries=geojson&overview=full&annotations=false`
      const res = await fetch(url)
      const data = await res.json()

      if (!data.routes?.length) throw new Error('No route found')

      const steps: RouteStep[] = []
      const usedInfra = new Set<string>()
      const allBounds: [number, number][] = []

      // Draw each step with its road classification colour
      for (const leg of data.routes[0].legs) {
        for (const step of leg.steps) {
          const name: string = step.name || ''
          const cls = classifyRoad(name)
          const geom = step.geometry?.coordinates as [number, number][]
          if (!geom?.length) continue

          const latLngs: [number, number][] = geom.map(([lng, lat]) => [lat, lng])
          allBounds.push(...latLngs)

          // Draw a subtle shadow/outline first for contrast
          const shadow = L.polyline(latLngs, { color: 'white', weight: cls.weight + 3, opacity: 0.6 }).addTo(map)
          const line = L.polyline(latLngs, { color: cls.color, weight: cls.weight, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(map)

          line.bindTooltip(`<strong>${name || 'Road'}</strong><br/><span style="color:${cls.color}">${cls.label}</span>`, {
            sticky: true,
            className: 'vp-route-tooltip',
          })

          layersRef.current.push(shadow, line)
          if (name) steps.push({ name, coords: latLngs, classification: cls })
          if (cls.label !== 'Local Road') usedInfra.add(cls.label)
        }
      }

      // Origin marker
      const fromIcon = L.divIcon({
        className: '',
        html: `<div style="background:#09090B;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:-apple-system,sans-serif;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,0.25);">${fromLabel}</div>`,
        iconAnchor: [50, 12],
      })
      const toIcon = L.divIcon({
        className: '',
        html: `<div style="background:#B8973B;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:-apple-system,sans-serif;white-space:nowrap;box-shadow:0 2px 12px rgba(184,151,59,0.4);">${toLabel}</div>`,
        iconAnchor: [50, 12],
      })

      layersRef.current.push(
        L.marker(fromCoords, { icon: fromIcon }).addTo(map),
        L.marker(toCoords, { icon: toIcon }).addTo(map),
      )

      if (allBounds.length) map.fitBounds(allBounds as any, { padding: [50, 50], maxZoom: 14 })

      setStatus('ready')
      onRouteLoaded?.(steps, Array.from(usedInfra))

    } catch (e) {
      // Fallback: simple dashed line
      const line = L.polyline([fromCoords, toCoords], {
        color: '#B8973B', weight: 3, opacity: 0.7, dashArray: '8 6',
      }).addTo(mapRef.current)

      const fromIcon = L.divIcon({
        className: '',
        html: `<div style="background:#09090B;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:-apple-system,sans-serif;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,0.25);">${fromLabel}</div>`,
        iconAnchor: [50, 12],
      })
      const toIcon = L.divIcon({
        className: '',
        html: `<div style="background:#B8973B;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:-apple-system,sans-serif;white-space:nowrap;box-shadow:0 2px 12px rgba(184,151,59,0.4);">${toLabel}</div>`,
        iconAnchor: [50, 12],
      })

      layersRef.current.push(
        line,
        L.marker(fromCoords, { icon: fromIcon }).addTo(mapRef.current),
        L.marker(toCoords, { icon: toIcon }).addTo(mapRef.current),
      )

      mapRef.current.fitBounds([fromCoords, toCoords] as any, { padding: [60, 60], maxZoom: 13 })
      setStatus('error')
    }
  }, [fromCoords, toCoords, fromLabel, toLabel])

  useEffect(() => { drawRoute() }, [drawRoute])

  useEffect(() => {
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <style>{`
        #connectivity-map .leaflet-control-attribution { display: none !important; }
        #connectivity-map .leaflet-control-zoom a { border-radius: 8px !important; border: 1px solid #E4E4E7 !important; color: #52525B !important; }
        #connectivity-map .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important; }
        .vp-route-tooltip { background: white !important; border: 1px solid #E4E4E7 !important; border-radius: 8px !important; padding: 6px 10px !important; font-size: 12px !important; font-family: -apple-system, sans-serif !important; box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important; }
        .vp-route-tooltip::before { display: none !important; }
      `}</style>
      <div id="connectivity-map" className="w-full h-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-[500]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#B8973B] border-t-transparent animate-spin" />
            <span className="text-xs text-[#71717A]">Calculating route…</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ConnectivityPage() {
  const [fromLocation, setFromLocation] = useState(locations[0])
  const [toDestination, setToDestination] = useState('BKC')
  const [activeTimeline, setActiveTimeline] = useState('Current')
  const [routeInfra, setRouteInfra] = useState<string[]>([])

  const travelInfo = TRAVEL_DATA[toDestination]
  const fromCoords: [number, number] = [fromLocation.coordinates[1], fromLocation.coordinates[0]]
  const toCoords: [number, number] = DESTINATION_COORDS[toDestination] ?? [19.065, 72.865]

  const visibleInfra = INFRASTRUCTURE.filter(infra => {
    if (activeTimeline === 'Current') return infra.status === 'Operational'
    if (activeTimeline === '2025') return infra.status === 'Operational' || infra.year <= '2025'
    if (activeTimeline === '2026') return infra.status === 'Operational' || infra.year <= '2026'
    if (activeTimeline === '2027') return infra.status === 'Operational' || infra.year <= '2027'
    return true
  })

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Intelligence</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">South Mumbai Connectivity Intelligence</h1>
          <p className="text-[#71717A] mt-3">Live route mapping with road-type colour coding — Sea Link, Coastal Road, Expressways and local roads.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Controls */}
          <div className="space-y-5">
            <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white">
              <h2 className="text-base font-medium text-[#09090B] mb-5">Route Explorer</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">From</label>
                  <select
                    value={fromLocation.id}
                    onChange={e => setFromLocation(locations.find(l => l.id === e.target.value)!)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-white focus:outline-none focus:border-[#B8973B]"
                  >
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="flex justify-center"><Navigation size={16} className="text-[#B8973B]" /></div>
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">To</label>
                  <select
                    value={toDestination}
                    onChange={e => setToDestination(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-white focus:outline-none focus:border-[#B8973B]"
                  >
                    {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {travelInfo && (
                <motion.div key={`${fromLocation.id}-${toDestination}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-3">
                  <div className="p-4 rounded-xl bg-[#F4F4F5]">
                    <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">Distance</div>
                    <div className="text-xl font-light text-[#09090B]">{travelInfo.distance}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#ECFDF5]">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock size={10} className="text-[#059669]" />
                        <span className="text-[10px] text-[#059669] uppercase tracking-wider font-semibold">Normal</span>
                      </div>
                      <div className="text-sm font-medium text-[#052e16]">{travelInfo.drive}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF7ED]">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock size={10} className="text-[#EA580C]" />
                        <span className="text-[10px] text-[#EA580C] uppercase tracking-wider font-semibold">Peak Hour</span>
                      </div>
                      <div className="text-sm font-medium text-[#431407]">{travelInfo.peak}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Road legend */}
            <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={14} className="text-[#B8973B]" />
                <span className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Road Legend</span>
              </div>
              <div className="space-y-2.5">
                {ROAD_LEGEND.map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <div className="w-5 h-1 rounded-full" style={{ background: r.color }} />
                      <div className="w-3 h-1 rounded-full" style={{ background: r.color, opacity: 0.5 }} />
                    </div>
                    <span className="text-xs text-[#52525B]">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure detected on route */}
            {routeInfra.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#F5EED4] border border-[#B8973B]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={13} className="text-[#B8973B]" />
                  <span className="text-xs font-semibold text-[#A07C2A] uppercase tracking-wider">Route Uses</span>
                </div>
                {routeInfra.map(r => (
                  <div key={r} className="text-xs text-[#78350F] py-1 border-b border-[#B8973B]/10 last:border-0">{r}</div>
                ))}
              </div>
            )}
          </div>

          {/* Live map */}
          <div className="lg:col-span-2 rounded-2xl border border-[#E4E4E7] overflow-hidden" style={{ minHeight: '520px' }}>
            <ConnectivityMap
              key={`${fromLocation.id}-${toDestination}`}
              fromCoords={fromCoords}
              toCoords={toCoords}
              fromLabel={fromLocation.name}
              toLabel={toDestination}
              onRouteLoaded={(_, infra) => setRouteInfra(infra)}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-light text-[#09090B] tracking-tight mb-5">Connectivity Timeline</h2>
          <div className="flex gap-2 flex-wrap">
            {TIMELINE.map(t => (
              <button key={t} onClick={() => setActiveTimeline(t)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', activeTimeline === t ? 'bg-[#09090B] text-white' : 'border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5]')}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Infrastructure grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-light text-[#09090B] tracking-tight">Infrastructure Layer</h2>
            <div className="flex gap-4 text-xs">
              {[{ color: '#059669', label: 'Operational' }, { color: '#EA580C', label: 'Under Construction' }, { color: '#2563EB', label: 'Proposed' }].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[#71717A]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleInfra.map((infra, i) => (
              <motion.div key={infra.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-3 p-4 rounded-xl border border-[#E4E4E7] bg-white">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: infra.color }} />
                <div>
                  <div className="text-sm font-medium text-[#09090B]">{infra.label}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#71717A]">{infra.year}</span>
                    <span className="text-[10px]" style={{ color: infra.color }}>{infra.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
