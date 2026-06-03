'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { locations } from '@/data/locations'
import { MapPin, Navigation, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const DESTINATIONS = [
  'BKC', 'Nariman Point', 'Airport (Chhatrapati Shivaji)', 'Navi Mumbai CBD',
  'Borivali', 'Thane', 'Panvel', 'Pune (Expressway)', 'Lonavala',
  'Powai', 'Andheri', 'Dadar', 'CSMT (CST)', 'Bandra Station'
]

const INFRASTRUCTURE = [
  { id: 'coastal-road', label: 'Mumbai Coastal Road', status: 'Operational', year: '2024', color: '#059669' },
  { id: 'bwsl', label: 'Bandra-Worli Sea Link', status: 'Operational', year: '2009', color: '#059669' },
  { id: 'atal-setu', label: 'Atal Setu (Mumbai Trans Harbour Link)', status: 'Operational', year: '2024', color: '#059669' },
  { id: 'metro-3', label: 'Metro Line 3 (Aqua Line)', status: 'Operational', year: '2024', color: '#059669' },
  { id: 'coastal-north', label: 'Coastal Road North Extension', status: 'Under Construction', year: '2026', color: '#EA580C' },
  { id: 'bvsl', label: 'Bandra–Versova Sea Link', status: 'Proposed', year: '2027', color: '#2563EB' },
  { id: 'worli-sewri', label: 'Worli–Sewri Elevated Connector', status: 'Under Construction', year: '2026', color: '#EA580C' },
  { id: 'orange-gate', label: 'Orange Gate – Marine Drive Tunnel', status: 'Under Construction', year: '2026', color: '#EA580C' },
  { id: 'metro-11', label: 'Metro Line 11 (Wadala–CSMT)', status: 'Under Construction', year: '2027', color: '#EA580C' },
  { id: 'eastern-freeway', label: 'Eastern Freeway', status: 'Operational', year: '2013', color: '#059669' },
  { id: 'bullet-train', label: 'Mumbai–Ahmedabad Bullet Train', status: 'Under Construction', year: '2028', color: '#EA580C' },
  { id: 'bkc-airport', label: 'Worli Sea Link – BKC – Airport Tunnel', status: 'Proposed', year: '2029', color: '#2563EB' },
  { id: 'thane-borivali', label: 'Thane–Borivali Twin Tunnel', status: 'Under Construction', year: '2027', color: '#EA580C' },
  { id: 'atal-pune', label: 'Atal Setu – Mumbai Pune Expressway Connector', status: 'Proposed', year: '2028', color: '#2563EB' },
]

const TIMELINE = ['Current', '2025', '2026', '2027', '2028+']

// Approximate travel times from Worli (mock data for demonstration)
const TRAVEL_DATA: Record<string, { drive: string; peak: string; distance: string }> = {
  'BKC': { drive: '12-15 min', peak: '20-35 min', distance: '8.5 km' },
  'Nariman Point': { drive: '15-20 min', peak: '25-40 min', distance: '9.2 km' },
  'Airport (Chhatrapati Shivaji)': { drive: '25-35 min', peak: '40-60 min', distance: '18 km' },
  'Navi Mumbai CBD': { drive: '30-40 min', peak: '45-65 min', distance: '25 km' },
  'Borivali': { drive: '45-55 min', peak: '70-90 min', distance: '38 km' },
  'Thane': { drive: '40-50 min', peak: '60-80 min', distance: '30 km' },
  'Panvel': { drive: '50-65 min', peak: '75-95 min', distance: '42 km' },
  'Pune (Expressway)': { drive: '2.5-3 hr', peak: '3-4 hr', distance: '155 km' },
  'Lonavala': { drive: '1.5-2 hr', peak: '2-2.5 hr', distance: '96 km' },
  'Powai': { drive: '35-45 min', peak: '55-75 min', distance: '25 km' },
  'Andheri': { drive: '30-40 min', peak: '50-70 min', distance: '22 km' },
  'Dadar': { drive: '10-15 min', peak: '18-25 min', distance: '5.8 km' },
  'CSMT (CST)': { drive: '20-25 min', peak: '30-45 min', distance: '14 km' },
  'Bandra Station': { drive: '15-20 min', peak: '25-40 min', distance: '10 km' },
}

export default function ConnectivityPage() {
  const [fromLocation, setFromLocation] = useState(locations[0].name)
  const [toDestination, setToDestination] = useState('BKC')
  const [activeTimeline, setActiveTimeline] = useState('Current')
  const [showInfra, setShowInfra] = useState(true)

  const travelInfo = TRAVEL_DATA[toDestination]

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Intelligence</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">South Mumbai Connectivity Intelligence</h1>
          <p className="text-[#71717A] mt-3">Real travel times, infrastructure layers, and future connectivity across South Mumbai.</p>
        </motion.div>

        {/* Route explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 p-6 rounded-2xl border border-[#E4E4E7] bg-white">
            <h2 className="text-base font-medium text-[#09090B] mb-5">Route Explorer</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">From</label>
                <select
                  value={fromLocation}
                  onChange={e => setFromLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-white focus:outline-none focus:border-[#B8973B]"
                >
                  {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-center">
                <Navigation size={16} className="text-[#B8973B]" />
              </div>

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
              <motion.div key={`${fromLocation}-${toDestination}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
                <div className="p-4 rounded-xl bg-[#F4F4F5]">
                  <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">Distance</div>
                  <div className="text-xl font-light text-[#09090B]">{travelInfo.distance}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#ECFDF5]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={12} className="text-[#059669]" />
                      <div className="text-[10px] text-[#059669] uppercase tracking-wider font-semibold">Drive</div>
                    </div>
                    <div className="text-base font-medium text-[#052e16]">{travelInfo.drive}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FFF7ED]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={12} className="text-[#EA580C]" />
                      <div className="text-[10px] text-[#EA580C] uppercase tracking-wider font-semibold">Peak Hour</div>
                    </div>
                    <div className="text-base font-medium text-[#431407]">{travelInfo.peak}</div>
                  </div>
                </div>
                <div className="text-xs text-[#A1A1AA] text-center">Approximate times from {fromLocation}</div>
              </motion.div>
            )}
          </div>

          {/* Map placeholder with infrastructure overlay */}
          <div className="lg:col-span-2 rounded-2xl border border-[#E4E4E7] overflow-hidden relative" style={{ minHeight: '400px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8F0F8] to-[#D4E5F7]" />
            {/* Simplified Mumbai map visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/80 flex items-center justify-center mb-4 mx-auto">
                  <MapPin size={24} className="text-[#B8973B]" />
                </div>
                <div className="text-[#52525B] font-medium">Interactive Map</div>
                <div className="text-[#A1A1AA] text-sm mt-1">Configure Mapbox token to activate</div>
                <div className="text-xs text-[#B8973B] mt-2">{fromLocation} → {toDestination}</div>
              </div>
            </div>
            {/* Route summary overlay */}
            {travelInfo && (
              <div className="absolute bottom-4 left-4 glass rounded-xl p-3 shadow-lg">
                <div className="text-xs font-semibold text-[#09090B]">{fromLocation} → {toDestination}</div>
                <div className="text-xs text-[#71717A] mt-0.5">{travelInfo.distance} · {travelInfo.drive}</div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-10">
          <h2 className="text-xl font-light text-[#09090B] tracking-tight mb-6">Connectivity Timeline</h2>
          <div className="flex gap-2 mb-6">
            {TIMELINE.map(t => (
              <button
                key={t}
                onClick={() => setActiveTimeline(t)}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', activeTimeline === t ? 'bg-[#09090B] text-white' : 'border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5]')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Infrastructure layer */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-[#09090B] tracking-tight">Infrastructure Layer</h2>
            <div className="flex gap-3 text-xs">
              {[
                { color: '#059669', label: 'Operational' },
                { color: '#EA580C', label: 'Under Construction' },
                { color: '#2563EB', label: 'Proposed' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[#71717A]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INFRASTRUCTURE.filter(infra => {
              if (activeTimeline === 'Current') return infra.status === 'Operational'
              if (activeTimeline === '2025') return infra.status === 'Operational' || infra.year <= '2025'
              if (activeTimeline === '2026') return infra.status === 'Operational' || infra.year <= '2026'
              if (activeTimeline === '2027') return infra.status === 'Operational' || infra.year <= '2027'
              return true
            }).map(infra => (
              <motion.div
                key={infra.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#E4E4E7] bg-white"
              >
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
