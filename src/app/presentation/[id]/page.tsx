'use client'

import { use, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectById } from '@/data/projects'
import { locations } from '@/data/locations'
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type Objective = 'End User' | 'Investor' | 'Family Office' | 'NRI Buyer' | null

const OBJECTIVE_CONFIG: Record<NonNullable<Objective>, { color: string; emphasis: string[]; badge: string }> = {
  'End User': {
    color: '#059669',
    emphasis: ['Amenities', 'Lifestyle', 'Location', 'Schools', 'Connectivity', 'Community'],
    badge: 'End User Focus',
  },
  'Investor': {
    color: '#2563EB',
    emphasis: ['Appreciation', 'Rental Yield', 'Market Performance', 'Capital Growth', 'Supply Scarcity'],
    badge: 'Investor Focus',
  },
  'NRI Buyer': {
    color: '#7C3AED',
    emphasis: ['Brand Value', 'Asset Preservation', 'Rental Potential', 'Long-Term Growth'],
    badge: 'NRI Focus',
  },
  'Family Office': {
    color: '#B8973B',
    emphasis: ['Wealth Preservation', 'Trophy Asset Status', 'Legacy Ownership', 'Limited Inventory'],
    badge: 'Family Office Focus',
  },
}

export default function PresentationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = getProjectById(id)
  if (!project) notFound()

  const location = locations.find(l => l.id === project.locationId)
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [objective, setObjective] = useState<Objective>(null)
  const [showObjectiveSelect, setShowObjectiveSelect] = useState(false)

  const objConfig = objective ? OBJECTIVE_CONFIG[objective] : null

  const allImages = project.images.length ? project.images : [project.heroImage]

  const SLIDES = [
    { id: 'hero', label: 'Overview' },
    { id: 'specs', label: 'Specifications' },
    { id: 'configurations', label: 'Configurations' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'amenities', label: 'Amenities' },
    ...(objective === 'Investor' || objective === 'NRI Buyer' || objective === 'Family Office'
      ? [{ id: 'investment', label: 'Investment Case' }]
      : []),
    { id: 'advisory', label: 'Advisory' },
  ]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrent(c => Math.min(c + 1, SLIDES.length - 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrent(c => Math.max(c - 1, 0))
      if (e.key === 'Escape') { setFullscreen(false); setShowObjectiveSelect(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [SLIDES.length])

  const slide = SLIDES[current]

  return (
    <div className={cn('bg-[#09090B] text-white', fullscreen ? 'fixed inset-0 z-[9999]' : 'min-h-screen')}>

      {/* Top bar */}
      <div className="absolute top-4 left-0 right-0 z-50 flex items-center justify-between px-6">
        {/* Project name — always visible */}
        <div className="flex items-center gap-3">
          <div>
            <div className="text-white/40 text-[10px] tracking-widest uppercase font-medium">Presenting</div>
            <div className="text-white text-sm font-semibold tracking-wide">{project.name}</div>
          </div>
          {objConfig && (
            <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: `${objConfig.color}25`, color: objConfig.color, border: `1px solid ${objConfig.color}40` }}>
              {objConfig.badge}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => setShowObjectiveSelect(!showObjectiveSelect)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
            <Users size={11} /> {objective || 'Client Type'}
          </button>
          <button onClick={() => setFullscreen(!fullscreen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
            {fullscreen ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
            {fullscreen ? 'Exit Full' : 'Full Screen'}
          </button>
          <Link href={`/properties/${project.locationId}/${project.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
            <X size={11} /> Exit
          </Link>
        </div>
      </div>

      {/* Client objective selector dropdown */}
      <AnimatePresence>
        {showObjectiveSelect && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-16 right-4 z-50 bg-[#18181B] border border-white/10 rounded-2xl p-4 w-72 shadow-2xl">
            <div className="text-xs text-white/50 uppercase tracking-widest mb-3">Select Client Objective</div>
            <div className="space-y-2">
              {(Object.keys(OBJECTIVE_CONFIG) as Objective[]).map(obj => (
                <button key={obj!} onClick={() => { setObjective(obj); setShowObjectiveSelect(false) }} className={cn('w-full text-left px-4 py-3 rounded-xl border transition-all', objective === obj ? 'bg-white text-[#09090B] border-transparent' : 'border-white/10 text-white/80 hover:border-white/30')}>
                  <div className="text-sm font-medium">{obj}</div>
                  <div className="text-xs mt-0.5 opacity-60">{OBJECTIVE_CONFIG[obj!]!.emphasis.slice(0, 3).join(' · ')}</div>
                </button>
              ))}
              {objective && <button onClick={() => { setObjective(null); setShowObjectiveSelect(false) }} className="w-full text-left px-4 py-2 text-xs text-white/40 hover:text-white/70 transition-colors">Clear selection</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrent(i)} className={cn('h-1.5 rounded-full transition-all', i === current ? 'bg-[#B8973B] w-6' : 'bg-white/25 w-1.5 hover:bg-white/50')} />
        ))}
      </div>

      {/* Brand watermark */}
      <div className="absolute bottom-6 left-6 z-50 opacity-30">
        <div className="text-xs text-white">Value Properties</div>
        <div className="text-[10px] text-[#B8973B] tracking-widest uppercase">Curated by Sreeja</div>
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div key={slide.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} className="h-screen flex flex-col items-center justify-center px-12 md:px-20 py-24">

          {slide.id === 'hero' && (
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-4">{project.developer} · {project.location}</div>
                <h1 style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>{project.name}</h1>
                <div className={cn('inline-flex mt-5 px-4 py-1.5 rounded-full text-sm font-medium', project.possessionStatus === 'Ready To Move' ? 'bg-[#059669]/20 text-[#4ADE80]' : 'bg-[#EA580C]/20 text-[#FB923C]')}>
                  {project.possessionStatus}
                </div>
                <p className="mt-5 text-[#A1A1AA] text-base leading-relaxed font-light">{project.elevationExplained}</p>
                <div className="mt-8 flex items-baseline gap-3">
                  <div className="text-2xl font-light">{project.configurations[0]?.price}</div>
                  <div className="text-[#B8973B] text-sm">onwards</div>
                </div>
                {objConfig && (
                  <div className="mt-6 p-4 rounded-2xl" style={{ background: `${objConfig.color}15`, border: `1px solid ${objConfig.color}25` }}>
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: objConfig.color }}>Key for {objective}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {objConfig.emphasis.slice(0, 4).map(e => <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">{e}</span>)}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative h-[450px] rounded-3xl overflow-hidden hidden md:block">
                <img src={project.heroImage} alt={project.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/40 to-transparent" />
              </div>
            </div>
          )}

          {slide.id === 'specs' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-12">Built to a different standard.</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Land Parcel', value: project.landParcel },
                  { label: 'Towers', value: String(project.towers) },
                  { label: 'Total Storeys', value: String(project.totalStoreys) },
                  { label: 'First Floor', value: `Floor ${project.firstHabitableFloor}` },
                  { label: 'Ceiling Height', value: project.ceilingHeight },
                  { label: 'Tenure', value: project.tenure },
                  { label: 'Price / Sq Ft', value: `₹${(project.currentPricePerSqFt/1000).toFixed(0)}K` },
                  { label: 'Car Park', value: project.carParkType },
                  { label: 'Rental Yield', value: project.rentalYield || '—' },
                ].map(spec => (
                  <div key={spec.label} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[#B8973B] text-[10px] uppercase tracking-widest mb-2">{spec.label}</div>
                    <div className="text-xl font-light">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.id === 'configurations' && (
            <div className="max-w-4xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-10">Find your perfect home.</h2>
              <div className="space-y-4">
                {project.configurations.map((config, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#B8973B]/40 transition-colors">
                    <div>
                      <div className="text-2xl font-light">{config.type}</div>
                      <div className="text-[#A1A1AA] mt-1 text-sm">{config.carpetArea}</div>
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

          {slide.id === 'gallery' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-8">The vision.</h2>
              <div className="grid grid-cols-2 gap-4 h-[420px]">
                <div className="row-span-2 rounded-3xl overflow-hidden">
                  <img src={allImages[0]} alt="" className="w-full h-full object-cover" />
                </div>
                {allImages.slice(1, 3).map((img, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.id === 'amenities' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-10">A complete world within.</h2>
              {project.amenitiesCategories ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.amenitiesCategories.map(cat => (
                    <div key={cat.category} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[#B8973B] text-sm mb-3 font-medium">{cat.icon} {cat.category}</div>
                      {cat.items.slice(0, 4).map(item => (
                        <div key={item} className="flex items-center gap-2 text-sm text-[#D4D4D8] py-0.5">
                          <div className="w-1 h-1 rounded-full bg-[#B8973B]" />{item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {project.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B8973B]" /><span className="text-sm text-[#D4D4D8]">{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {slide.id === 'investment' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-10">
                {objective === 'Investor' ? 'The investment case.' : objective === 'NRI Buyer' ? 'Your India asset.' : 'A generational asset.'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Price / Sq Ft', value: `₹${(project.currentPricePerSqFt/1000).toFixed(0)}K` },
                  { label: 'Rental Yield', value: project.rentalYield || '—' },
                  { label: 'Appreciation', value: (project.appreciationPercentage ?? 0) > 0 ? `+${project.appreciationPercentage}%` : 'N/A' },
                  { label: 'Since', value: String(project.launchYear || '—') },
                ].map(s => (
                  <div key={s.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-[#B8973B] text-[10px] uppercase tracking-widest mb-2">{s.label}</div>
                    <div className="text-2xl font-light">{s.value}</div>
                  </div>
                ))}
              </div>
              {project.investmentThesis && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[#B8973B] text-[10px] uppercase tracking-widest mb-3">Investment Thesis</div>
                  <p className="text-[#A1A1AA] leading-relaxed">{project.investmentThesis}</p>
                </div>
              )}
              {objConfig && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {objConfig.emphasis.map(e => <span key={e} className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80">{e}</span>)}
                </div>
              )}
            </div>
          )}

          {slide.id === 'advisory' && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase mb-2">{project.name} · Advisory Note · Curated by Sreeja</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-8">Why this project.</h2>
              {project.whyRecommend && (
                <p className="text-[#A1A1AA] text-xl font-light leading-relaxed mb-8 italic border-l-2 border-[#B8973B] pl-5">&ldquo;{project.whyRecommend}&rdquo;</p>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#059669]/10 border border-[#059669]/20">
                  <div className="text-[#4ADE80] text-xs font-semibold uppercase tracking-widest mb-4">Strengths</div>
                  <ul className="space-y-2">{project.strengths.map(s => <li key={s} className="flex gap-2 text-sm text-[#D4D4D8]"><span className="text-[#4ADE80]">+</span>{s}</li>)}</ul>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[#B8973B] text-xs font-semibold uppercase tracking-widest mb-4">Best Suited For</div>
                  <div className="flex flex-wrap gap-2 mb-5">{project.bestSuitedFor.map(t => <span key={t} className="px-3 py-1.5 rounded-xl bg-[#B8973B]/20 text-[#D4AF5A] text-sm">{t}</span>)}</div>
                  {project.investmentThesis && <p className="text-sm text-[#A1A1AA] leading-relaxed">{project.investmentThesis.slice(0, 120)}…</p>}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 right-6 flex items-center gap-3 z-50">
        <button onClick={() => setCurrent(c => Math.max(c - 1, 0))} disabled={current === 0} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors touch-manipulation">
          <ChevronLeft size={18} />
        </button>
        <span className="text-white/40 text-sm tabular-nums">{current + 1} / {SLIDES.length}</span>
        <button onClick={() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1))} disabled={current === SLIDES.length - 1} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors touch-manipulation">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
