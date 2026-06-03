'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Filter, Building2 } from 'lucide-react'
import { locations } from '@/data/locations'
import { getProjectsByLocation } from '@/data/projects'
import { Location, Project } from '@/types'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const FILTERS = [
  { id: 'sea-view', label: 'Sea View' },
  { id: 'ready', label: 'Ready Projects' },
  { id: 'under-construction', label: 'Under Construction' },
  { id: 'branded', label: 'Branded Residences' },
  { id: 'sky-mansion', label: 'Sky Mansions' },
]

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-[#71717A]">{label}</span>
        <span className="text-xs font-semibold text-[#09090B]">{score}</span>
      </div>
      <div className="h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-[#B8973B] to-[#D4AF5A]"
        />
      </div>
    </div>
  )
}

export default function MapIntelligence() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])
  const circlesRef = useRef<any>(null)

  const locationProjects = selectedLocation ? getProjectsByLocation(selectedLocation.id) : []

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    let map: any
    ;(async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      // Fix default icon paths for Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      map = L.map(mapContainerRef.current!, {
        center: [19.0200, 72.8347],
        zoom: 12,
        zoomControl: false,
      })

      mapRef.current = map

      // Premium light tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'topright' }).addTo(map)

      // Custom gold dot icon
      const goldIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:12px;height:12px;border-radius:50%;
          background:#B8973B;border:2px solid white;
          box-shadow:0 2px 8px rgba(184,151,59,0.5);
          cursor:pointer;transition:transform 0.2s;
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })

      const activeIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:16px;height:16px;border-radius:50%;
          background:#B8973B;border:3px solid white;
          box-shadow:0 2px 16px rgba(184,151,59,0.7);
          cursor:pointer;
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      locations.forEach(location => {
        const [lng, lat] = location.coordinates
        const marker = L.marker([lat, lng], { icon: goldIcon })
          .addTo(map)
          .bindTooltip(location.name, {
            permanent: false,
            direction: 'top',
            className: 'leaflet-tooltip-custom',
            offset: [0, -8],
          })

        marker.on('click', () => {
          // Reset all markers
          markersRef.current.forEach(m => m.marker.setIcon(goldIcon))
          marker.setIcon(activeIcon)

          // Remove previous circle
          if (circlesRef.current) circlesRef.current.remove()

          // Draw highlight circle
          circlesRef.current = L.circle([lat, lng], {
            radius: 600,
            color: '#B8973B',
            fillColor: '#B8973B',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '4 4',
          }).addTo(map)

          map.flyTo([lat, lng], 14, { duration: 1.2, easeLinearity: 0.4 })
          setSelectedLocation(location)
          setSelectedProject(null)
        })

        markersRef.current.push({ marker, locationId: location.id })
      })
    })()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  const flyTo = (location: Location) => {
    if (!mapRef.current) return
    const [lng, lat] = location.coordinates
    mapRef.current.flyTo([lat, lng], 14, { duration: 1.2, easeLinearity: 0.4 })
  }

  return (
    <>
      {/* Leaflet tooltip style */}
      <style>{`
        .leaflet-tooltip-custom {
          background: white;
          border: 1px solid #E4E4E7;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          color: #09090B;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .leaflet-tooltip-custom::before { display: none; }
        .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }
        .leaflet-control-attribution { display: none !important; }
      `}</style>

      <div className="flex h-screen pt-20 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-[#E4E4E7] overflow-y-auto">
          <div className="p-4 border-b border-[#E4E4E7]">
            <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-1">Micro-Markets</div>
            <div className="text-sm text-[#52525B]">South Mumbai</div>
          </div>

          {/* Filters */}
          <div className="p-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-1.5 mb-2">
              <Filter size={12} className="text-[#A1A1AA]" />
              <span className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase">Filter</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggleFilter(f.id)}
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full border transition-all',
                    activeFilters.includes(f.id)
                      ? 'bg-[#B8973B] border-[#B8973B] text-white'
                      : 'border-[#E4E4E7] text-[#71717A] hover:border-[#B8973B]/40'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location list */}
          <div className="p-2">
            {locations.map(location => (
              <button
                key={location.id}
                onClick={() => {
                  setSelectedLocation(location)
                  setSelectedProject(null)
                  flyTo(location)
                }}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-xl transition-all group',
                  selectedLocation?.id === location.id
                    ? 'bg-[#09090B] text-white'
                    : 'hover:bg-[#F4F4F5] text-[#09090B]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{location.name}</span>
                  <MapPin size={12} className={selectedLocation?.id === location.id ? 'text-[#B8973B]' : 'text-[#D4D4D8] group-hover:text-[#B8973B]'} />
                </div>
                <div className={cn('text-xs mt-0.5', selectedLocation?.id === location.id ? 'text-white/60' : 'text-[#A1A1AA]')}>
                  {location.averagePricing.split('-')[0].trim()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="absolute inset-0" />
        </div>

        {/* Right panel — Location Intelligence */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              key={selectedLocation.id}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 bg-white border-l border-[#E4E4E7] overflow-y-auto flex-shrink-0"
            >
              <div className="p-5 border-b border-[#E4E4E7]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-1">Selected Area</div>
                    <h2 className="text-xl font-light text-[#09090B] tracking-tight">{selectedLocation.name}</h2>
                  </div>
                  <button onClick={() => setSelectedLocation(null)} className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#A1A1AA] transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">{selectedLocation.description}</p>
              </div>

              <div className="p-5 border-b border-[#E4E4E7]">
                <div className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase mb-2">Average Pricing</div>
                <div className="text-base font-medium text-[#09090B]">{selectedLocation.averagePricing}</div>
              </div>

              <div className="p-5 border-b border-[#E4E4E7]">
                <div className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase mb-4">Intelligence Scores</div>
                <div className="space-y-3">
                  <ScoreBar score={selectedLocation.connectivityScore} label="Connectivity" />
                  <ScoreBar score={selectedLocation.infrastructureScore} label="Infrastructure" />
                  <ScoreBar score={selectedLocation.lifestyleScore} label="Lifestyle" />
                  <ScoreBar score={selectedLocation.futureGrowthScore} label="Future Growth" />
                </div>
              </div>

              <div className="p-5">
                <div className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase mb-4">
                  Projects ({locationProjects.length})
                </div>
                {locationProjects.length === 0 ? (
                  <p className="text-xs text-[#A1A1AA]">No projects listed for this location yet.</p>
                ) : (
                  <div className="space-y-3">
                    {locationProjects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="w-full text-left p-3 rounded-xl border border-[#E4E4E7] hover:border-[#B8973B]/30 hover:bg-[#FAFAFA] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <img src={project.elevationImage} alt={project.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[#09090B] truncate">{project.name}</div>
                            <div className="text-xs text-[#71717A] mt-0.5">{project.developer}</div>
                            <div className={cn('inline-flex text-[10px] px-2 py-0.5 rounded-full mt-1.5',
                              project.possessionStatus === 'Ready To Move' ? 'bg-[#ECFDF5] text-[#059669]' :
                              project.possessionStatus === 'Under Construction' ? 'bg-[#FFF7ED] text-[#EA580C]' : 'bg-[#EFF6FF] text-[#2563EB]'
                            )}>
                              {project.possessionStatus}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <Link
                  href={`/properties/${selectedLocation.slug}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E4E4E7] text-sm text-[#52525B] hover:bg-[#F4F4F5] transition-colors"
                >
                  View All in {selectedLocation.name}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project mini card */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl w-96 z-[1000] border border-white/60"
            >
              <div className="flex items-start gap-3">
                <img src={selectedProject.elevationImage} alt={selectedProject.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#09090B]">{selectedProject.name}</div>
                  <div className="text-xs text-[#71717A]">{selectedProject.developer} · {selectedProject.location}</div>
                  <div className="text-xs text-[#B8973B] mt-1">₹{(selectedProject.currentPricePerSqFt / 1000).toFixed(0)}K per sq ft</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Link href={`/properties/${selectedProject.locationId}/${selectedProject.id}`} className="px-3 py-1 rounded-lg bg-[#09090B] text-white text-xs">Details</Link>
                  <button onClick={() => setSelectedProject(null)} className="px-3 py-1 rounded-lg border border-[#E4E4E7] text-xs text-[#71717A]">Close</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
