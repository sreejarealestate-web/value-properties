'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Filter, Building2 } from 'lucide-react'
import { locations } from '@/data/locations'
import { getProjectsByLocation } from '@/data/projects'
import { locationBoundaries } from '@/data/boundaries'
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
  const dotMarkersRef = useRef<Record<string, any>>({})
  const projectMarkersRef = useRef<any[]>([])
  const boundaryLayerRef = useRef<any>(null)

  const locationProjects = selectedLocation ? getProjectsByLocation(selectedLocation.id) : []

  const toggleFilter = (id: string) =>
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

  useEffect(() => {
    if (!mapRef.current) return
    // Update project pins when selectedLocation changes
    const updateProjectPins = async () => {
      const L = (await import('leaflet')).default
      // Remove old project markers
      projectMarkersRef.current.forEach(m => m.remove())
      projectMarkersRef.current = []

      if (!selectedLocation) return
      const projs = getProjectsByLocation(selectedLocation.id)

      projs.forEach(project => {
        const [lng, lat] = project.coordinates
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            display:flex;align-items:center;gap:5px;
            background:white;border:1.5px solid #B8973B;
            border-radius:20px;padding:4px 8px 4px 5px;
            box-shadow:0 2px 12px rgba(184,151,59,0.25);
            cursor:pointer;white-space:nowrap;
          ">
            <div style="width:7px;height:7px;border-radius:50%;background:#B8973B;flex-shrink:0;"></div>
            <span style="font-size:11px;font-weight:500;color:#09090B;font-family:-apple-system,sans-serif;">${project.name}</span>
          </div>`,
          iconAnchor: [0, 12],
        })

        const marker = L.marker([lat, lng], { icon })
          .addTo(mapRef.current)
          .on('click', () => setSelectedProject(project))

        projectMarkersRef.current.push(marker)
      })
    }

    updateProjectPins()
  }, [selectedLocation])

  useEffect(() => {
    if (!mapRef.current) return

    const highlightBoundary = async () => {
      const L = (await import('leaflet')).default

      // Remove old boundary
      if (boundaryLayerRef.current) {
        boundaryLayerRef.current.remove()
        boundaryLayerRef.current = null
      }
      if (!selectedLocation) return

      const coords = locationBoundaries[selectedLocation.id]
      if (!coords) return

      boundaryLayerRef.current = L.polygon(coords, {
        color: '#B8973B',
        fillColor: '#B8973B',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '6 4',
      }).addTo(mapRef.current)
    }

    highlightBoundary()
  }, [selectedLocation])

  useEffect(() => {
    if (!mapRef.current) {
      ;(async () => {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')

        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        const map = L.map('intelligence-map', {
          center: [19.0200, 72.8347],
          zoom: 12,
          zoomControl: false,
        })
        mapRef.current = map

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map)

        L.control.zoom({ position: 'topright' }).addTo(map)

        // Gold dot marker for each location
        const dotIcon = (active = false) => L.divIcon({
          className: '',
          html: `<div style="
            width:${active ? 14 : 10}px;height:${active ? 14 : 10}px;
            border-radius:50%;background:#B8973B;
            border:${active ? 3 : 2}px solid white;
            box-shadow:0 2px ${active ? 16 : 8}px rgba(184,151,59,${active ? 0.7 : 0.4});
            cursor:pointer;transition:all 0.2s;
          "></div>`,
          iconSize: [active ? 14 : 10, active ? 14 : 10],
          iconAnchor: [active ? 7 : 5, active ? 7 : 5],
        })

        locations.forEach(location => {
          const [lng, lat] = location.coordinates
          const marker = L.marker([lat, lng], { icon: dotIcon() })
            .addTo(map)
            .bindTooltip(location.name, {
              permanent: false,
              direction: 'top',
              className: 'vp-tooltip',
              offset: [0, -8],
            })

          dotMarkersRef.current[location.id] = marker

          marker.on('click', () => {
            // Reset all dots
            Object.entries(dotMarkersRef.current).forEach(([id, m]) =>
              m.setIcon(dotIcon(id === location.id))
            )
            map.flyTo([lat, lng], 14, { duration: 1.2, easeLinearity: 0.4 })
            setSelectedLocation(location)
            setSelectedProject(null)
          })
        })
      })()
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        dotMarkersRef.current = {}
        projectMarkersRef.current = []
        boundaryLayerRef.current = null
      }
    }
  }, [])

  const flyTo = (location: Location) => {
    if (!mapRef.current) return
    const [lng, lat] = location.coordinates
    mapRef.current.flyTo([lat, lng], 14, { duration: 1.2, easeLinearity: 0.4 })
    Object.entries(dotMarkersRef.current).forEach(([id, m]) => {
      const dotIcon = (active = false) => {
        const L = (window as any).L
        if (!L) return
        return L.divIcon({
          className: '',
          html: `<div style="width:${active ? 14 : 10}px;height:${active ? 14 : 10}px;border-radius:50%;background:#B8973B;border:${active ? 3 : 2}px solid white;box-shadow:0 2px ${active ? 16 : 8}px rgba(184,151,59,${active ? 0.7 : 0.4});cursor:pointer;"></div>`,
          iconSize: [active ? 14 : 10, active ? 14 : 10],
          iconAnchor: [active ? 7 : 5, active ? 7 : 5],
        })
      }
      const icon = dotIcon(id === location.id)
      if (icon) m.setIcon(icon)
    })
  }

  return (
    <>
      <style>{`
        .vp-tooltip {
          background: white !important;
          border: 1px solid #E4E4E7 !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          color: #09090B !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
        }
        .vp-tooltip::before { display: none !important; }
        .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          border: 1px solid #E4E4E7 !important;
          color: #52525B !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important; }
      `}</style>

      <div className="flex h-screen pt-20 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-[#E4E4E7] overflow-y-auto">
          <div className="p-4 border-b border-[#E4E4E7]">
            <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-1">Micro-Markets</div>
            <div className="text-sm text-[#52525B]">South Mumbai</div>
          </div>

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
          <div id="intelligence-map" className="absolute inset-0" />
        </div>

        {/* Right panel */}
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
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#A1A1AA] transition-colors"
                  >
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
                            <div className={cn(
                              'inline-flex text-[10px] px-2 py-0.5 rounded-full mt-1.5',
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
