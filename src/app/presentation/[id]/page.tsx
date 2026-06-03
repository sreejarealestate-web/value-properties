'use client'

import { use, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectById } from '@/data/projects'
import { locations } from '@/data/locations'
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, BookOpen, GitCompare } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = (project: ReturnType<typeof getProjectById>) => {
  if (!project) return []
  return [
    { id: 'overview', type: 'overview' },
    { id: 'specs', type: 'specs' },
    { id: 'configurations', type: 'configurations' },
    { id: 'gallery', type: 'gallery' },
    { id: 'amenities', type: 'amenities' },
    { id: 'advisory', type: 'advisory' },
  ]
}

export default function PresentationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = getProjectById(id)
  if (!project) notFound()

  const location = locations.find(l => l.id === project.locationId)
  const allSlides = slides(project)
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrent(c => Math.min(c + 1, allSlides.length - 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrent(c => Math.max(c - 1, 0))
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [allSlides.length])

  const slide = allSlides[current]

  return (
    <div className={cn('bg-[#09090B] text-white', fullscreen ? 'fixed inset-0 z-[9999]' : 'min-h-screen pt-20')}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Link href={`/properties/${project.locationId}/${project.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
          <X size={12} /> Exit
        </Link>
        <button onClick={() => setFullscreen(!fullscreen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
          {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          {fullscreen ? 'Exit Full' : 'Full Screen'}
        </button>
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {allSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={cn('w-1.5 h-1.5 rounded-full transition-all', i === current ? 'bg-[#B8973B] w-4' : 'bg-white/30 hover:bg-white/50')} />
        ))}
      </div>

      {/* Brand watermark */}
      <div className="absolute bottom-6 left-6 z-50 opacity-40">
        <div className="text-xs text-white">Value Properties</div>
        <div className="text-[10px] text-[#B8973B] tracking-widest uppercase">Curated by Sreeja</div>
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="h-screen flex flex-col items-center justify-center px-16 py-24"
        >
          {slide.type === 'overview' && (
            <div className="max-w-5xl w-full">
              <div className="grid grid-cols-2 gap-16 items-center">
                <div>
                  <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-4">{project.developer} · {project.location}</div>
                  <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {project.name}
                  </h1>
                  <div className={cn('inline-flex mt-6 px-4 py-1.5 rounded-full text-sm font-medium',
                    project.possessionStatus === 'Ready To Move' ? 'bg-[#059669]/20 text-[#4ADE80]' : 'bg-[#EA580C]/20 text-[#FB923C]'
                  )}>
                    {project.possessionStatus}
                  </div>
                  <p className="mt-6 text-[#A1A1AA] text-lg leading-relaxed font-light">{project.elevationExplained}</p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="text-2xl font-light">{project.configurations[0]?.price}</div>
                    <div className="text-[#B8973B]">onwards</div>
                  </div>
                </div>
                <div className="relative h-[500px] rounded-3xl overflow-hidden">
                  <img src={project.heroImage} alt={project.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/30 to-transparent" />
                </div>
              </div>
            </div>
          )}

          {slide.type === 'specs' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-4">Project Specifications</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-12">
                Built to a different standard.
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Land Parcel', value: project.landParcel },
                  { label: 'Towers', value: String(project.towers) },
                  { label: 'Total Storeys', value: String(project.totalStoreys) },
                  { label: 'First Floor', value: `Floor ${project.firstHabitableFloor}` },
                  { label: 'Ceiling Height', value: project.ceilingHeight },
                  { label: 'Tenure', value: project.tenure },
                  { label: 'Price/Sq Ft', value: `₹${(project.currentPricePerSqFt/1000).toFixed(0)}K` },
                  { label: 'Car Park', value: project.carParkType },
                  { label: 'Rental Yield', value: project.rentalYield || '—' },
                ].map(spec => (
                  <div key={spec.label} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[#B8973B] text-xs uppercase tracking-widest mb-2">{spec.label}</div>
                    <div className="text-xl font-light">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'configurations' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-4">Configurations & Pricing</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-12">
                Find your perfect home.
              </h2>
              <div className="space-y-4">
                {project.configurations.map((config, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#B8973B]/50 transition-colors">
                    <div>
                      <div className="text-2xl font-light">{config.type}</div>
                      <div className="text-[#A1A1AA] mt-1">{config.carpetArea}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-[#B8973B]">{config.price}</div>
                      {config.pricePerSqFt && <div className="text-[#A1A1AA] text-sm mt-1">{config.pricePerSqFt} / sq ft</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'gallery' && (
            <div className="max-w-6xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-4">Gallery</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-8">
                The vision.
              </h2>
              <div className="grid grid-cols-2 gap-4 h-[450px]">
                <div className="row-span-2 rounded-3xl overflow-hidden">
                  <img src={project.images[0] || project.heroImage} alt="" className="w-full h-full object-cover" />
                </div>
                {project.images.slice(1, 3).map((img, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'amenities' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-4">Amenities</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-12">
                A complete world within.
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {project.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B8973B]" />
                    <span className="text-sm text-[#D4D4D8]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'advisory' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-4">Advisory Note · Curated by Sreeja</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-8">
                Why this project.
              </h2>
              {project.whyRecommend && (
                <p className="text-[#A1A1AA] text-xl font-light leading-relaxed mb-10 italic">&ldquo;{project.whyRecommend}&rdquo;</p>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#059669]/10 border border-[#059669]/20">
                  <div className="text-[#4ADE80] text-xs font-semibold uppercase tracking-widest mb-4">Strengths</div>
                  <ul className="space-y-2">
                    {project.strengths.map(s => (
                      <li key={s} className="flex gap-2 text-sm text-[#D4D4D8]">
                        <span className="text-[#4ADE80]">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[#B8973B] text-xs font-semibold uppercase tracking-widest mb-4">Best Suited For</div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.bestSuitedFor.map(type => (
                      <span key={type} className="px-3 py-1.5 rounded-xl bg-[#B8973B]/20 text-[#D4AF5A] text-sm">{type}</span>
                    ))}
                  </div>
                  {project.investmentThesis && (
                    <p className="text-sm text-[#A1A1AA] leading-relaxed">{project.investmentThesis}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 right-8 flex items-center gap-3 z-50">
        <button
          onClick={() => setCurrent(c => Math.max(c - 1, 0))}
          disabled={current === 0}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-white/40 text-sm">{current + 1} / {allSlides.length}</span>
        <button
          onClick={() => setCurrent(c => Math.min(c + 1, allSlides.length - 1))}
          disabled={current === allSlides.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
