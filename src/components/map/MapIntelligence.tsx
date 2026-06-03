'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, TrendingUp, Zap, Heart, Building2, Filter } from 'lucide-react'
import { locations } from '@/data/locations'
import { projects, getProjectsByLocation } from '@/data/projects'
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

function ProjectPin({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1 cursor-pointer"
    >
      <div className="w-8 h-8 rounded-full bg-[#B8973B] border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform">
        <Building2 size={12} className="text-white" />
      </div>
      <span className="text-[10px] font-medium text-[#09090B] bg-white/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap max-w-[120px] truncate">
        {project.name}
      </span>
    </button>
  )
}

export default function MapIntelligence() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const locationProjects = selectedLocation
    ? getProjectsByLocation(selectedLocation.id)
    : []

  const toggleFilter = (id: string) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    if (!mapContainerRef.current) return

    let map: any
    ;(async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

      map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [72.8347, 19.0200],
        zoom: 12.5,
        pitch: 45,
        bearing: -10,
        antialias: true,
      })

      mapRef.current = map

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

      map.on('load', () => {
        setMapLoaded(true)

        // Add location markers
        locations.forEach(location => {
          const el = document.createElement('div')
          el.className = 'location-marker'
          el.style.cssText = `
            width: 10px; height: 10px;
            border-radius: 50%;
            background: #B8973B;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(184,151,59,0.4);
            cursor: pointer;
            transition: all 0.2s;
          `
          el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.5)' })
          el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })

          const marker = new mapboxgl.Marker(el)
            .setLngLat(location.coordinates)
            .addTo(map)

          el.addEventListener('click', () => {
            setSelectedLocation(location)
            setSelectedProject(null)
            map.flyTo({
              center: location.coordinates,
              zoom: 14,
              pitch: 50,
              duration: 1200,
              essential: true,
            })
          })
        })

        // Add 3D buildings
        const layers = map.getStyle().layers
        const labelLayerId = layers.find(
          (l: any) => l.type === 'symbol' && l.layout?.['text-field']
        )?.id

        map.addLayer({
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 13,
          paint: {
            'fill-extrusion-color': '#F4F4F5',
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
            'fill-extrusion-opacity': 0.8,
          },
        }, labelLayerId)
      })
    })()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="flex h-screen pt-20 overflow-hidden">
      {/* Left Sidebar — Locations */}
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
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: location.coordinates,
                    zoom: 14,
                    pitch: 50,
                    duration: 1200,
                    essential: true,
                  })
                }
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

        {!mapLoaded && (
          <div className="absolute inset-0 bg-[#F4F4F5] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#B8973B] border-t-transparent animate-spin mx-auto mb-3" />
              <div className="text-sm text-[#71717A]">Loading intelligence map…</div>
            </div>
          </div>
        )}
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
            {/* Header */}
            <div className="p-5 border-b border-[#E4E4E7]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-1">Selected Area</div>
                  <h2 className="text-xl font-light text-[#09090B] tracking-tight">{selectedLocation.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#A1A1AA] hover:text-[#09090B] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-[#71717A] leading-relaxed">{selectedLocation.description}</p>
            </div>

            {/* Pricing */}
            <div className="p-5 border-b border-[#E4E4E7]">
              <div className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase mb-3">Average Pricing</div>
              <div className="text-base font-medium text-[#09090B]">{selectedLocation.averagePricing}</div>
            </div>

            {/* Scores */}
            <div className="p-5 border-b border-[#E4E4E7]">
              <div className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase mb-4">Intelligence Scores</div>
              <div className="space-y-3">
                <ScoreBar score={selectedLocation.connectivityScore} label="Connectivity" />
                <ScoreBar score={selectedLocation.infrastructureScore} label="Infrastructure" />
                <ScoreBar score={selectedLocation.lifestyleScore} label="Lifestyle" />
                <ScoreBar score={selectedLocation.futureGrowthScore} label="Future Growth" />
              </div>
            </div>

            {/* Projects */}
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
                      className="w-full text-left p-3 rounded-xl border border-[#E4E4E7] hover:border-[#B8973B]/30 hover:bg-[#FAFAFA] transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={project.elevationImage}
                          alt={project.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-[#09090B] truncate">{project.name}</div>
                          <div className="text-xs text-[#71717A] mt-0.5">{project.developer}</div>
                          <div className={cn('inline-flex text-[10px] px-2 py-0.5 rounded-full mt-1.5',
                            project.possessionStatus === 'Ready To Move' ? 'bg-[#ECFDF5] text-[#059669]' :
                            project.possessionStatus === 'Under Construction' ? 'bg-[#FFF7ED] text-[#EA580C]' :
                            'bg-[#EFF6FF] text-[#2563EB]'
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

      {/* Project detail mini card */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl p-4 shadow-xl w-96 z-20"
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
  )
}
