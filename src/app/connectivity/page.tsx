'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Navigation, Layers, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Full Mumbai location list ──────────────────────────────────────────────
const ALL_LOCATIONS: { label: string; coords: [number, number] }[] = [
  { label: 'Colaba', coords: [18.9067, 72.8147] },
  { label: 'Cuffe Parade', coords: [18.9125, 72.8188] },
  { label: 'Nariman Point', coords: [18.9256, 72.8242] },
  { label: 'Marine Drive', coords: [18.9440, 72.8237] },
  { label: 'Churchgate', coords: [18.9356, 72.8258] },
  { label: 'Fort', coords: [18.9340, 72.8352] },
  { label: 'Byculla', coords: [18.9741, 72.8328] },
  { label: 'Mazgaon', coords: [18.9651, 72.8447] },
  { label: 'Sewri', coords: [19.0031, 72.8614] },
  { label: 'Dadar', coords: [19.0178, 72.8478] },
  { label: 'Prabhadevi', coords: [19.0039, 72.8246] },
  { label: 'Worli', coords: [18.9984, 72.8162] },
  { label: 'Lower Parel', coords: [18.9913, 72.8272] },
  { label: 'Mahalaxmi', coords: [18.9824, 72.8215] },
  { label: 'Tardeo', coords: [18.9706, 72.8158] },
  { label: 'Altamount Road', coords: [18.9664, 72.8100] },
  { label: 'Malabar Hill', coords: [18.9547, 72.8047] },
  { label: 'Walkeshwar', coords: [18.9511, 72.8027] },
  { label: 'Marine Lines', coords: [18.9396, 72.8208] },
  { label: 'Nepean Sea Road', coords: [18.9680, 72.8065] },
  { label: 'Carmichael Road', coords: [18.9678, 72.8073] },
  { label: 'Babulnath', coords: [18.9563, 72.8069] },
  { label: 'Gamdevi', coords: [18.9606, 72.8079] },
  { label: 'Bandra', coords: [19.0596, 72.8347] },
  { label: 'Khar', coords: [19.0728, 72.8361] },
  { label: 'Santacruz', coords: [19.0833, 72.8368] },
  { label: 'Juhu', coords: [19.0969, 72.8264] },
  { label: 'BKC (Bandra Kurla Complex)', coords: [19.0650, 72.8651] },
  { label: 'Andheri', coords: [19.1136, 72.8697] },
  { label: 'Powai', coords: [19.1176, 72.9060] },
  { label: 'Ghatkopar', coords: [19.0863, 72.9081] },
  { label: 'Chembur', coords: [19.0522, 72.9005] },
  { label: 'Vikhroli', coords: [19.1064, 72.9289] },
  { label: 'Mulund', coords: [19.1726, 72.9560] },
  { label: 'Thane', coords: [19.2183, 72.9781] },
  { label: 'Borivali', coords: [19.2307, 72.8567] },
  { label: 'Mira Road', coords: [19.2813, 72.8706] },
  { label: 'Navi Mumbai (CBD Belapur)', coords: [19.0252, 73.0267] },
  { label: 'Vashi', coords: [19.0771, 73.0068] },
  { label: 'Nerul', coords: [19.0368, 73.0158] },
  { label: 'Kharghar', coords: [19.0475, 73.0686] },
  { label: 'Panvel', coords: [18.9894, 73.1175] },
  { label: 'Navi Mumbai Airport', coords: [18.9921, 73.1196] },
  { label: 'Mumbai Airport (CSIA)', coords: [19.0896, 72.8656] },
  { label: 'Pune', coords: [18.5204, 73.8567] },
  { label: 'Lonavala', coords: [18.7537, 73.4068] },
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
  { id: 'atal-pune', label: 'Atal Setu – Pune Expressway Connector', status: 'Proposed', year: '2028', color: '#2563EB' },
]

const TIMELINE = ['Current', '2025', '2026', '2027', '2028+']

// Approximate travel times from Worli as baseline (minutes driving)
const TRAVEL_TIMES: Record<string, { drive: string; peak: string; distance: string }> = {
  'Colaba': { drive: '20–25 min', peak: '30–45 min', distance: '11 km' },
  'Cuffe Parade': { drive: '18–22 min', peak: '28–40 min', distance: '10 km' },
  'Nariman Point': { drive: '15–20 min', peak: '25–40 min', distance: '9.2 km' },
  'Marine Drive': { drive: '12–18 min', peak: '20–35 min', distance: '7.5 km' },
  'Churchgate': { drive: '18–22 min', peak: '28–38 min', distance: '11 km' },
  'Fort': { drive: '22–28 min', peak: '32–45 min', distance: '13 km' },
  'Byculla': { drive: '15–20 min', peak: '22–35 min', distance: '9 km' },
  'Mazgaon': { drive: '18–22 min', peak: '25–38 min', distance: '11 km' },
  'Sewri': { drive: '15–20 min', peak: '22–32 min', distance: '10 km' },
  'Dadar': { drive: '10–15 min', peak: '18–25 min', distance: '5.8 km' },
  'Prabhadevi': { drive: '5–8 min', peak: '10–18 min', distance: '2.5 km' },
  'Worli': { drive: '0 min', peak: '0 min', distance: '0 km' },
  'Lower Parel': { drive: '8–12 min', peak: '14–22 min', distance: '4 km' },
  'Mahalaxmi': { drive: '6–10 min', peak: '12–20 min', distance: '3.2 km' },
  'Tardeo': { drive: '10–14 min', peak: '16–24 min', distance: '5 km' },
  'Altamount Road': { drive: '12–16 min', peak: '18–28 min', distance: '5.8 km' },
  'Malabar Hill': { drive: '14–18 min', peak: '22–32 min', distance: '7 km' },
  'Walkeshwar': { drive: '16–20 min', peak: '24–35 min', distance: '7.5 km' },
  'Marine Lines': { drive: '15–20 min', peak: '22–35 min', distance: '8 km' },
  'Nepean Sea Road': { drive: '10–14 min', peak: '16–24 min', distance: '5 km' },
  'Carmichael Road': { drive: '12–16 min', peak: '18–26 min', distance: '5.5 km' },
  'Babulnath': { drive: '15–18 min', peak: '22–30 min', distance: '7 km' },
  'Gamdevi': { drive: '13–16 min', peak: '20–28 min', distance: '6 km' },
  'Bandra': { drive: '12–15 min', peak: '20–35 min', distance: '8.5 km' },
  'Khar': { drive: '18–22 min', peak: '28–40 min', distance: '12 km' },
  'Santacruz': { drive: '22–28 min', peak: '35–50 min', distance: '15 km' },
  'Juhu': { drive: '28–35 min', peak: '45–60 min', distance: '19 km' },
  'BKC (Bandra Kurla Complex)': { drive: '12–15 min', peak: '20–35 min', distance: '8.5 km' },
  'Andheri': { drive: '30–40 min', peak: '50–70 min', distance: '22 km' },
  'Powai': { drive: '35–45 min', peak: '55–75 min', distance: '25 km' },
  'Ghatkopar': { drive: '38–48 min', peak: '58–80 min', distance: '27 km' },
  'Chembur': { drive: '28–36 min', peak: '42–60 min', distance: '20 km' },
  'Vikhroli': { drive: '40–50 min', peak: '60–80 min', distance: '28 km' },
  'Mulund': { drive: '50–60 min', peak: '70–90 min', distance: '35 km' },
  'Thane': { drive: '40–50 min', peak: '60–80 min', distance: '30 km' },
  'Borivali': { drive: '45–55 min', peak: '70–90 min', distance: '38 km' },
  'Mira Road': { drive: '55–65 min', peak: '80–100 min', distance: '44 km' },
  'Navi Mumbai (CBD Belapur)': { drive: '30–40 min', peak: '45–65 min', distance: '25 km' },
  'Vashi': { drive: '28–36 min', peak: '42–58 min', distance: '22 km' },
  'Nerul': { drive: '32–40 min', peak: '48–65 min', distance: '26 km' },
  'Kharghar': { drive: '38–48 min', peak: '55–75 min', distance: '30 km' },
  'Panvel': { drive: '50–65 min', peak: '75–95 min', distance: '42 km' },
  'Navi Mumbai Airport': { drive: '50–65 min', peak: '75–95 min', distance: '42 km' },
  'Mumbai Airport (CSIA)': { drive: '25–35 min', peak: '40–60 min', distance: '18 km' },
  'Pune': { drive: '2.5–3 hr', peak: '3–4 hr', distance: '155 km' },
  'Lonavala': { drive: '1.5–2 hr', peak: '2–2.5 hr', distance: '96 km' },
}

function classifyRoad(name: string): { color: string; weight: number; label: string } {
  const n = (name || '').toLowerCase()
  if (n.includes('sea link') || n.includes('bandra-worli') || n.includes('bandra–worli') || n.includes('rajiv gandhi'))
    return { color: '#B8973B', weight: 5, label: 'Bandra-Worli Sea Link' }
  if (n.includes('coastal road') || n.includes('coastal'))
    return { color: '#059669', weight: 5, label: 'Mumbai Coastal Road' }
  if (n.includes('eastern freeway') || n.includes('eastern express'))
    return { color: '#7C3AED', weight: 5, label: 'Eastern Freeway' }
  if (n.includes('western express') || n.includes('sv road') || n.includes('s.v. road') || n.includes('link road'))
    return { color: '#2563EB', weight: 4, label: 'Western Express Highway' }
  if (n.includes('atal setu') || n.includes('trans harbour') || n.includes('nhava sheva'))
    return { color: '#DC2626', weight: 5, label: 'Atal Setu' }
  if (n.includes('expressway') || n.includes('national highway') || n.includes('nh') || n.includes('mumbai pune'))
    return { color: '#EA580C', weight: 4, label: 'Expressway / NH' }
  if (n.includes('flyover') || n.includes('elevated') || n.includes('freeway'))
    return { color: '#8B5CF6', weight: 4, label: 'Elevated / Flyover' }
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

// ─── Map component ──────────────────────────────────────────────────────────
function ConnectivityMap({ fromCoords, toCoords, fromLabel, toLabel, onRouteLoaded }:
  { fromCoords: [number,number]; toCoords: [number,number]; fromLabel: string; toLabel: string; onRouteLoaded?: (infra: string[]) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const layersRef = useRef<any[]>([])
  const [status, setStatus] = useState<'idle'|'loading'|'ready'|'error'>('idle')

  const initAndDraw = useCallback(async () => {
    if (!containerRef.current) return
    setStatus('loading')

    const L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')

    // Init map only once
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [19.05, 72.87],
        zoom: 11,
        zoomControl: false,
        preferCanvas: true,
      })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '', subdomains: 'abcd', maxZoom: 19,
      }).addTo(mapRef.current)
      L.control.zoom({ position: 'topright' }).addTo(mapRef.current)
    }

    const map = mapRef.current

    // Remove previous route layers
    layersRef.current.forEach(l => { try { l.remove() } catch {} })
    layersRef.current = []

    // Label icons
    const makeLabel = (text: string, bg: string) => L.divIcon({
      className: '',
      html: `<div style="background:${bg};color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:-apple-system,sans-serif;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,0.2);">${text}</div>`,
      iconAnchor: [50, 12],
    })

    // Try OSRM routing
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?steps=true&geometries=geojson&overview=full`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) throw new Error('OSRM error')
      const data = await res.json()
      if (!data.routes?.length) throw new Error('No route')

      const usedInfra = new Set<string>()
      const allLatLngs: [number,number][] = []

      for (const leg of data.routes[0].legs) {
        for (const step of leg.steps) {
          const geom = step.geometry?.coordinates as [number,number][]
          if (!geom?.length) continue
          const lls: [number,number][] = geom.map(([lng, lat]) => [lat, lng])
          allLatLngs.push(...lls)
          const cls = classifyRoad(step.name || '')
          const shadow = L.polyline(lls, { color: 'white', weight: cls.weight + 3, opacity: 0.5 }).addTo(map)
          const line = L.polyline(lls, { color: cls.color, weight: cls.weight, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(map)
          line.bindTooltip(`<strong>${step.name || 'Road'}</strong><br/><span style="color:${cls.color};font-size:11px">${cls.label}</span>`, { sticky: true, className: 'vp-route-tip' })
          layersRef.current.push(shadow, line)
          if (cls.label !== 'Local Road') usedInfra.add(cls.label)
        }
      }

      layersRef.current.push(
        L.marker(fromCoords, { icon: makeLabel(fromLabel, '#09090B') }).addTo(map),
        L.marker(toCoords, { icon: makeLabel(toLabel, '#B8973B') }).addTo(map),
      )
      if (allLatLngs.length) map.fitBounds(allLatLngs as any, { padding: [50,50], maxZoom: 14 })
      setStatus('ready')
      onRouteLoaded?.(Array.from(usedInfra))

    } catch {
      // Fallback: straight dashed line
      const line = L.polyline([fromCoords, toCoords], { color: '#B8973B', weight: 3, opacity: 0.75, dashArray: '8 6' }).addTo(map)
      layersRef.current.push(
        line,
        L.marker(fromCoords, { icon: makeLabel(fromLabel, '#09090B') }).addTo(map),
        L.marker(toCoords, { icon: makeLabel(toLabel, '#B8973B') }).addTo(map),
      )
      map.fitBounds([fromCoords, toCoords] as any, { padding: [60,60], maxZoom: 13 })
      setStatus('error')
    }
  }, [fromCoords, toCoords, fromLabel, toLabel])

  // Init on mount
  useEffect(() => { initAndDraw() }, [initAndDraw])

  // Cleanup only on unmount
  useEffect(() => () => {
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
  }, [])

  return (
    <div className="relative w-full h-full">
      <style>{`
        #connectivity-map-container .leaflet-control-attribution{display:none!important}
        #connectivity-map-container .leaflet-control-zoom a{border-radius:8px!important;border:1px solid #E4E4E7!important;color:#52525B!important}
        #connectivity-map-container .leaflet-control-zoom{border:none!important;box-shadow:0 2px 12px rgba(0,0,0,0.08)!important}
        .vp-route-tip{background:white!important;border:1px solid #E4E4E7!important;border-radius:8px!important;padding:6px 10px!important;font-size:12px!important;font-family:-apple-system,sans-serif!important;box-shadow:0 4px 16px rgba(0,0,0,0.1)!important}
        .vp-route-tip::before{display:none!important}
      `}</style>
      <div id="connectivity-map-container" ref={containerRef} className="w-full h-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[500] rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-[#B8973B] border-t-transparent animate-spin" />
            <span className="text-xs text-[#71717A] font-medium">Calculating route…</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function ConnectivityPage() {
  const [fromIdx, setFromIdx] = useState(11) // Worli default
  const [toIdx, setToIdx] = useState(27)     // BKC default
  const [activeTimeline, setActiveTimeline] = useState('Current')
  const [routeInfra, setRouteInfra] = useState<string[]>([])

  const from = ALL_LOCATIONS[fromIdx]
  const to = ALL_LOCATIONS[toIdx]
  const travelInfo = TRAVEL_TIMES[to.label]

  const visibleInfra = INFRASTRUCTURE.filter(i => {
    if (activeTimeline === 'Current') return i.status === 'Operational'
    if (activeTimeline === '2025') return i.status === 'Operational' || i.year <= '2025'
    if (activeTimeline === '2026') return i.status === 'Operational' || i.year <= '2026'
    if (activeTimeline === '2027') return i.status === 'Operational' || i.year <= '2027'
    return true
  })

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Intelligence</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">South Mumbai Connectivity Intelligence</h1>
          <p className="text-[#71717A] mt-3">Live route mapping with road-type colour coding across all of Mumbai.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Controls */}
          <div className="space-y-5">
            <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white">
              <h2 className="text-base font-medium text-[#09090B] mb-5">Route Explorer</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">From</label>
                  <select value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-white focus:outline-none focus:border-[#B8973B]">
                    {ALL_LOCATIONS.map((l, i) => <option key={l.label} value={i}>{l.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-center"><Navigation size={16} className="text-[#B8973B]" /></div>
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">To</label>
                  <select value={toIdx} onChange={e => setToIdx(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-white focus:outline-none focus:border-[#B8973B]">
                    {ALL_LOCATIONS.map((l, i) => <option key={l.label} value={i}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              {travelInfo && (
                <motion.div key={`${fromIdx}-${toIdx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-3">
                  <div className="p-4 rounded-xl bg-[#F4F4F5]">
                    <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">Distance</div>
                    <div className="text-xl font-light text-[#09090B]">{travelInfo.distance}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#ECFDF5]">
                      <div className="flex items-center gap-1 mb-1"><Clock size={10} className="text-[#059669]" /><span className="text-[10px] text-[#059669] uppercase tracking-wider font-semibold">Normal</span></div>
                      <div className="text-sm font-medium text-[#052e16]">{travelInfo.drive}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF7ED]">
                      <div className="flex items-center gap-1 mb-1"><Clock size={10} className="text-[#EA580C]" /><span className="text-[10px] text-[#EA580C] uppercase tracking-wider font-semibold">Peak Hour</span></div>
                      <div className="text-sm font-medium text-[#431407]">{travelInfo.peak}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#A1A1AA] text-center">Approx. times from {from.label}</p>
                </motion.div>
              )}
            </div>

            {/* Legend */}
            <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
              <div className="flex items-center gap-2 mb-4"><Layers size={14} className="text-[#B8973B]" /><span className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Road Legend</span></div>
              <div className="space-y-2.5">
                {ROAD_LEGEND.map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <div className="w-5 h-1.5 rounded-full" style={{ background: r.color }} />
                      <div className="w-2 h-1.5 rounded-full opacity-40" style={{ background: r.color }} />
                    </div>
                    <span className="text-xs text-[#52525B]">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {routeInfra.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#F5EED4] border border-[#B8973B]/20">
                <div className="flex items-center gap-2 mb-3"><Info size={13} className="text-[#B8973B]" /><span className="text-xs font-semibold text-[#A07C2A] uppercase tracking-wider">Route Uses</span></div>
                {routeInfra.map(r => <div key={r} className="text-xs text-[#78350F] py-1 border-b border-[#B8973B]/10 last:border-0">{r}</div>)}
              </div>
            )}
          </div>

          {/* Live map */}
          <div className="lg:col-span-2 rounded-2xl border border-[#E4E4E7] overflow-hidden" style={{ minHeight: '520px' }}>
            <ConnectivityMap
              key={`${fromIdx}-${toIdx}`}
              fromCoords={from.coords}
              toCoords={to.coords}
              fromLabel={from.label}
              toLabel={to.label}
              onRouteLoaded={setRouteInfra}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-light text-[#09090B] tracking-tight mb-5">Connectivity Timeline</h2>
          <div className="flex gap-2 flex-wrap">
            {TIMELINE.map(t => (
              <button key={t} onClick={() => setActiveTimeline(t)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', activeTimeline === t ? 'bg-[#09090B] text-white' : 'border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5]')}>{t}</button>
            ))}
          </div>
        </div>

        {/* Infrastructure grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-light text-[#09090B] tracking-tight">Infrastructure Layer</h2>
            <div className="flex gap-4 text-xs">
              {[{ color: '#059669', label: 'Operational' }, { color: '#EA580C', label: 'Under Construction' }, { color: '#2563EB', label: 'Proposed' }].map(s => (
                <div key={s.label} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: s.color }} /><span className="text-[#71717A]">{s.label}</span></div>
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
