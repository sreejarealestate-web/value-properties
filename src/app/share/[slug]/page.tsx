'use client'

import { use, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { getCollectionBySlug, getAllProjects } = useAppStore()
  const collection = getCollectionBySlug(slug)
  const allProjects = getAllProjects()

  const [activeIdx, setActiveIdx] = useState(0)
  const [slideIdx, setSlideIdx] = useState(0)

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-center px-6">
        <div>
          <div className="text-[#B8973B] text-xs tracking-widest uppercase mb-4">Value Properties</div>
          <h1 className="text-2xl font-light text-white mb-3">Presentation not found</h1>
          <p className="text-[#71717A] text-sm">This link may have expired or been removed.</p>
        </div>
      </div>
    )
  }

  const projects = collection.projectIds.map(id => allProjects.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p))

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white text-center">
        <p>No projects in this presentation.</p>
      </div>
    )
  }

  const project = projects[activeIdx]
  const allImages = project?.images?.length ? project.images : [project?.heroImage || '']
  const SLIDES = ['overview', 'specs', 'gallery', 'amenities']
  const slide = SLIDES[slideIdx] || 'overview'

  return (
    <div className="fixed inset-0 bg-[#09090B] text-white overflow-hidden">
      {/* Cover bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <div>
          <div className="text-[10px] text-[#B8973B] tracking-widest uppercase">Value Properties · Curated by Sreeja</div>
          <div className="text-sm font-medium text-white mt-0.5">For {collection.clientName}</div>
        </div>
        {/* Project tabs */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/10 rounded-2xl p-1">
          {projects.map((p, i) => (
            <button key={p!.id} onClick={() => { setActiveIdx(i); setSlideIdx(0) }} className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-all', activeIdx === i ? 'bg-white text-[#09090B]' : 'text-white/70 hover:text-white')}>
              {p!.name.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-white/40">{activeIdx + 1} / {projects.length}</div>
      </div>

      {/* Slide dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 md:hidden">
        {SLIDES.map((_, i) => <button key={i} onClick={() => setSlideIdx(i)} className={cn('h-1.5 rounded-full transition-all', i === slideIdx ? 'bg-[#B8973B] w-5' : 'bg-white/25 w-1.5')} />)}
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div key={`${activeIdx}-${slide}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.6 }} className="h-full flex items-center justify-center px-10 md:px-20 py-24">

          {slide === 'overview' && project && (
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-[#B8973B] text-xs tracking-widest uppercase mb-4">{project.developer} · {project.location}</div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{project.name}</h1>
                <div className={cn('inline-flex mt-5 px-4 py-1.5 rounded-full text-sm', project.possessionStatus === 'Ready To Move' ? 'bg-[#059669]/20 text-[#4ADE80]' : 'bg-[#EA580C]/20 text-[#FB923C]')}>
                  {project.possessionStatus}
                </div>
                <p className="mt-5 text-[#A1A1AA] leading-relaxed font-light">{project.elevationExplained}</p>
                <div className="mt-8 text-2xl font-light">{project.configurations[0]?.price} <span className="text-[#B8973B] text-base">onwards</span></div>
              </div>
              <div className="relative h-[420px] rounded-3xl overflow-hidden hidden md:block">
                <img src={project.heroImage} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {slide === 'specs' && project && (
            <div className="max-w-4xl w-full">
              <div className="text-[#B8973B] text-xs tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-10">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Land Parcel', value: project.landParcel },
                  { label: 'Towers', value: project.towers },
                  { label: 'Storeys', value: project.totalStoreys },
                  { label: 'Ceiling Height', value: project.ceilingHeight },
                  { label: 'Price/sqft', value: `₹${(project.currentPricePerSqFt/1000).toFixed(0)}K` },
                  { label: 'Tenure', value: project.tenure },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[#B8973B] text-[10px] uppercase tracking-widest mb-1.5">{s.label}</div>
                    <div className="text-xl font-light">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {project.configurations.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-lg font-light">{c.type} · {c.carpetArea}</span>
                    <span className="text-[#B8973B] text-lg font-light">{c.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide === 'gallery' && project && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-8">Gallery</h2>
              <div className="grid grid-cols-2 gap-4 h-[380px]">
                <div className="row-span-2 rounded-3xl overflow-hidden"><img src={allImages[0]} alt="" className="w-full h-full object-cover" /></div>
                {allImages.slice(1, 3).map((img, i) => <div key={i} className="rounded-3xl overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover" /></div>)}
              </div>
            </div>
          )}

          {slide === 'amenities' && project && (
            <div className="max-w-5xl w-full">
              <div className="text-[#B8973B] text-xs tracking-widest uppercase mb-2">{project.name}</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.025em' }} className="mb-10">Amenities</h2>
              {project.amenitiesCategories ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.amenitiesCategories.map(cat => (
                    <div key={cat.category} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[#B8973B] text-sm font-medium mb-3">{cat.icon} {cat.category}</div>
                      {cat.items.slice(0, 4).map(item => <div key={item} className="text-sm text-[#A1A1AA] py-0.5">· {item}</div>)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {project.amenities.map(a => <div key={a} className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-[#D4D4D8]">· {a}</div>)}
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Nav — slides */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
        <button onClick={() => { if (slideIdx > 0) setSlideIdx(s => s - 1); else if (activeIdx > 0) { setActiveIdx(a => a - 1); setSlideIdx(SLIDES.length - 1) } }} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center touch-manipulation">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => <button key={i} onClick={() => setSlideIdx(i)} className={cn('h-1.5 rounded-full transition-all', i === slideIdx ? 'bg-[#B8973B] w-5' : 'bg-white/25 w-1.5')} />)}
        </div>
        <button onClick={() => { if (slideIdx < SLIDES.length - 1) setSlideIdx(s => s + 1); else if (activeIdx < projects.length - 1) { setActiveIdx(a => a + 1); setSlideIdx(0) } }} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center touch-manipulation">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Mobile project switcher */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 md:hidden z-50">
        {projects.map((p, i) => <button key={p!.id} onClick={() => { setActiveIdx(i); setSlideIdx(0) }} className={cn('w-2 h-2 rounded-full transition-all', i === activeIdx ? 'bg-[#B8973B] w-5' : 'bg-white/30')} />)}
      </div>
    </div>
  )
}
