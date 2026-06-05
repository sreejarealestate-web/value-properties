'use client'

import { use, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locations } from '@/data/locations'
import { getProjectById } from '@/data/projects'
import { ArrowLeft, Maximize2, X, ChevronLeft, ChevronRight, Download, FileText, Map, LayoutGrid, Users, Star, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex)
  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-5 right-5 text-white/60 hover:text-white p-2" onClick={onClose}><X size={22} /></button>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2" onClick={e => { e.stopPropagation(); setIdx(i => Math.max(0, i - 1)) }}><ChevronLeft size={28} /></button>
      <img src={images[idx]} alt="" className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2" onClick={e => { e.stopPropagation(); setIdx(i => Math.min(images.length - 1, i + 1)) }}><ChevronRight size={28} /></button>
      <div className="absolute bottom-5 text-white/50 text-sm">{idx + 1} / {images.length}</div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, title, subtitle, children }: { id?: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-12 border-b border-[#F4F4F5]">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-[#09090B] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#71717A] mt-1.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#F4F4F5] last:border-0 gap-4">
      <span className="text-sm text-[#71717A] flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-[#09090B] text-right">{value}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectPage({ params }: { params: Promise<{ location: string; project: string }> }) {
  const { location: locationSlug, project: projectId } = use(params)
  const project = getProjectById(projectId)
  const location = locations.find(l => l.slug === locationSlug)
  if (!project || !location) notFound()

  const [activeImage, setActiveImage] = useState(0)
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null)
  const [lightboxStart, setLightboxStart] = useState(0)
  const [activeFloorPlan, setActiveFloorPlan] = useState(0)

  const openLightbox = (images: string[], index = 0) => { setLightboxImages(images); setLightboxStart(index) }

  const allImages = project.images.length ? project.images : [project.heroImage]

  const NAV_SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'master-layout', label: 'Master Layout' },
    { id: 'floor-plans', label: 'Floor Plans' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'residents', label: 'Residents' },
    { id: 'advisory', label: 'Advisory' },
  ]

  return (
    <div className="min-h-screen pt-20">
      {lightboxImages && <Lightbox images={lightboxImages} startIndex={lightboxStart} onClose={() => setLightboxImages(null)} />}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-[#A1A1AA]">
        <Link href="/properties" className="hover:text-[#09090B] transition-colors">Properties</Link>
        <span>/</span>
        <Link href={`/properties/${locationSlug}`} className="hover:text-[#09090B] transition-colors">{location.name}</Link>
        <span>/</span>
        <span className="text-[#09090B]">{project.name}</span>
      </div>

      {/* Hero gallery */}
      <div className="max-w-7xl mx-auto px-6 mb-0">
        <div className="grid grid-cols-4 gap-2 h-[480px] rounded-3xl overflow-hidden">
          <div className="col-span-3 relative overflow-hidden cursor-pointer" onClick={() => openLightbox(allImages, activeImage)}>
            <motion.img key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={allImages[activeImage]} alt={project.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
              <Maximize2 size={11} /> View Gallery
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {allImages.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={cn('flex-1 overflow-hidden rounded-xl', activeImage === i ? 'ring-2 ring-[#B8973B]' : 'opacity-70 hover:opacity-100 transition-opacity')}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky section nav */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E4E4E7] mt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {NAV_SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5] transition-all whitespace-nowrap">{s.label}</a>
            ))}
            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              <Link href={`/presentation/${project.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#09090B] text-white text-xs">
                <Maximize2 size={11} /> Present
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2">

            {/* Overview */}
            <section id="overview" className="py-12 border-b border-[#F4F4F5]">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map(tag => <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F5EED4] text-[#B8973B] font-semibold">{tag}</span>)}
                  </div>
                  <h1 className="text-4xl font-light text-[#09090B] tracking-tight">{project.name}</h1>
                  <p className="text-[#71717A] mt-2">{project.developer} · {project.location}</p>
                </div>
                <span className={cn('flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold',
                  project.possessionStatus === 'Ready To Move' ? 'bg-[#ECFDF5] text-[#059669]' :
                  project.possessionStatus === 'Under Construction' ? 'bg-[#FFF7ED] text-[#EA580C]' : 'bg-[#EFF6FF] text-[#2563EB]'
                )}>
                  {project.possessionStatus}{project.possessionDate ? ` — ${project.possessionDate}` : ''}
                </span>
              </div>

              {/* Key specs bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl bg-[#F4F4F5] mb-8">
                {[
                  { label: 'Towers', value: project.towers },
                  { label: 'Storeys', value: project.totalStoreys },
                  { label: 'Land Parcel', value: project.landParcel },
                  { label: 'Ceiling Height', value: project.ceilingHeight },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-light text-[#09090B]">{s.value}</div>
                    <div className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-0 mb-8">
                <DataRow label="Developer" value={project.developer} />
                <DataRow label="Land Parcel" value={project.landParcel} />
                <DataRow label="Tenure" value={project.tenure} />
                <DataRow label="Towers" value={project.towers} />
                <DataRow label="Apartments Per Floor" value={project.apartmentsPerFloor} />
                <DataRow label="First Habitable Floor" value={project.firstHabitableFloor} />
                <DataRow label="Ceiling Height" value={project.ceilingHeight} />
                <DataRow label="Car Park" value={project.carParkType} />
                <DataRow label="Maintenance" value={project.maintenance} />
                <DataRow label="View Types" value={project.viewTypes.join(', ')} />
              </div>

              {/* Google Maps location */}
              <div className="mb-8 rounded-2xl overflow-hidden border border-[#E4E4E7]">
                <iframe
                  title={`${project.name} location`}
                  width="100%"
                  height="240"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${project.coordinates[1]},${project.coordinates[0]}&z=15&output=embed`}
                />
                <div className="flex items-center justify-between px-4 py-3 bg-white">
                  <div className="flex items-center gap-2 text-sm text-[#52525B]">
                    <MapPin size={14} className="text-[#B8973B]" />
                    <span>{project.name}, {project.location}</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${project.coordinates[1]},${project.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#09090B] text-white text-xs font-medium hover:bg-[#27272A] transition-colors"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>

              {project.elevationExplained && (
                <div className="p-5 rounded-xl bg-[#F4F4F5]">
                  <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2">Elevation Explained</div>
                  <p className="text-sm text-[#52525B] leading-relaxed">{project.elevationExplained}</p>
                </div>
              )}
            </section>

            {/* Master Layout */}
            <section id="master-layout" className="py-12 border-b border-[#F4F4F5]">
              <div className="mb-8">
                <h2 className="text-2xl font-light text-[#09090B] tracking-tight">Master Layout</h2>
                <p className="text-sm text-[#71717A] mt-1.5">Site plan, tower positioning, and estate design</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-video bg-[#F4F4F5]"
                  onClick={() => openLightbox([project.heroImage])}
                >
                  <img src={project.heroImage} alt="Master Layout" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2"><Maximize2 size={16} className="text-[#09090B]" /></div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm">Aerial View</div>
                </div>
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-video bg-[#F4F4F5]"
                  onClick={() => openLightbox([project.images[1] || project.heroImage])}
                >
                  <img src={project.images[1] || project.heroImage} alt="Site Plan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2"><Maximize2 size={16} className="text-[#09090B]" /></div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm">Site Plan</div>
                </div>
              </div>
              {project.masterLayoutDescription && (
                <div className="p-5 rounded-xl bg-[#F4F4F5]">
                  <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Map size={11} /> Master Planning Note
                  </div>
                  <p className="text-sm text-[#52525B] leading-relaxed">{project.masterLayoutDescription}</p>
                </div>
              )}
            </section>

            {/* Floor Plans by Configuration */}
            <section id="floor-plans" className="py-12 border-b border-[#F4F4F5]">
              <div className="mb-8">
                <h2 className="text-2xl font-light text-[#09090B] tracking-tight">Floor Plans</h2>
                <p className="text-sm text-[#71717A] mt-1.5">Individual layouts by configuration</p>
              </div>

              {project.floorPlansByConfig && project.floorPlansByConfig.length > 0 ? (
                <>
                  {/* Config tabs */}
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {project.floorPlansByConfig.map((fp, i) => (
                      <button
                        key={fp.type}
                        onClick={() => setActiveFloorPlan(i)}
                        className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', activeFloorPlan === i ? 'bg-[#09090B] text-white' : 'border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5]')}
                      >
                        {fp.type}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {project.floorPlansByConfig.map((fp, i) => activeFloorPlan === i && (
                      <motion.div key={fp.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Floor plan image */}
                          <div
                            className="relative rounded-2xl overflow-hidden cursor-pointer group bg-[#F4F4F5] aspect-square"
                            onClick={() => openLightbox([fp.image])}
                          >
                            <img src={fp.image} alt={fp.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-2"><Maximize2 size={16} className="text-[#09090B]" /></div>
                            </div>
                            <div className="absolute top-3 left-3 bg-[#09090B] text-white text-[10px] px-2.5 py-1 rounded-full">{fp.type} Layout</div>
                          </div>

                          {/* Details */}
                          <div className="space-y-4">
                            <div>
                              <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-1">{fp.type}</div>
                              <div className="text-2xl font-light text-[#09090B]">{fp.carpetArea}</div>
                              <div className="flex items-center gap-3 mt-2 text-sm text-[#71717A]">
                                <span>{fp.bedrooms} Bed</span>
                                <span>·</span>
                                <span>{fp.bathrooms} Bath</span>
                              </div>
                            </div>
                            <p className="text-sm text-[#52525B] leading-relaxed">{fp.description}</p>
                            <div className="pt-2">
                              <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-3">Highlights</div>
                              <div className="space-y-2">
                                {fp.highlights.map(h => (
                                  <div key={h} className="flex items-center gap-2.5 text-sm text-[#52525B]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#B8973B] flex-shrink-0" />
                                    {h}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </>
              ) : (
                /* Fallback to simple floor plans */
                project.floorPlans && project.floorPlans.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {project.floorPlans.map((img, i) => (
                      <div key={i} className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-video" onClick={() => openLightbox(project.floorPlans, i)}>
                        <img src={img} alt={`Floor Plan ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-2"><Maximize2 size={16} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl border border-dashed border-[#E4E4E7] text-center text-[#A1A1AA] text-sm">Floor plans available on request.</div>
                )
              )}
            </section>

            {/* Pricing & Inventory */}
            <section id="pricing" className="py-12 border-b border-[#F4F4F5]">
              <div className="mb-8">
                <h2 className="text-2xl font-light text-[#09090B] tracking-tight">Configurations & Pricing</h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#E4E4E7] mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F4F4F5]">
                      {['Type', 'Carpet Area', 'Price', 'Per Sq Ft'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {project.configurations.map((config, i) => (
                      <tr key={i} className="border-t border-[#F4F4F5] hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-4 py-3.5 text-sm font-medium text-[#09090B]">{config.type}</td>
                        <td className="px-4 py-3.5 text-sm text-[#52525B]">{config.carpetArea}</td>
                        <td className="px-4 py-3.5 text-sm text-[#B8973B] font-semibold">{config.price}</td>
                        <td className="px-4 py-3.5 text-sm text-[#71717A]">{config.pricePerSqFt || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-[#09090B] mb-4">Available Inventory</div>
                <div className="space-y-2">
                  {project.availableInventory.filter(u => u.status === 'Available').map(unit => (
                    <div key={unit.id} className="flex items-center justify-between p-4 rounded-xl border border-[#E4E4E7] hover:border-[#B8973B]/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#059669]" />
                        <div>
                          <div className="text-sm font-medium text-[#09090B]">{unit.configuration} · Floor {unit.floor}</div>
                          <div className="text-xs text-[#71717A]">{unit.carpetArea} · {unit.view}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[#B8973B]">{unit.price}</div>
                    </div>
                  ))}
                  {project.availableInventory.filter(u => u.status === 'Available').length === 0 && (
                    <p className="text-sm text-[#A1A1AA] px-4">Contact us for current availability.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Amenities — categorised */}
            <section id="amenities" className="py-12 border-b border-[#F4F4F5]">
              <div className="mb-8">
                <h2 className="text-2xl font-light text-[#09090B] tracking-tight">Amenities</h2>
                <p className="text-sm text-[#71717A] mt-1.5">A complete world within</p>
              </div>

              {project.amenitiesCategories && project.amenitiesCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {project.amenitiesCategories.map(cat => (
                    <div key={cat.category} className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="text-[#B8973B] text-base">{cat.icon}</span>
                        <span className="text-sm font-semibold text-[#09090B]">{cat.category}</span>
                      </div>
                      <div className="space-y-2">
                        {cat.items.map(item => (
                          <div key={item} className="flex items-center gap-2 text-sm text-[#52525B]">
                            <div className="w-1 h-1 rounded-full bg-[#D4D4D8] flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {project.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 p-3 rounded-xl bg-[#F4F4F5]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B8973B]" />
                      <span className="text-xs text-[#52525B]">{amenity}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Notable Residents */}
            {project.notableResidents && project.notableResidents.length > 0 && (
              <section id="residents" className="py-12 border-b border-[#F4F4F5]">
                <div className="mb-8">
                  <h2 className="text-2xl font-light text-[#09090B] tracking-tight">Who Lives Here</h2>
                  <p className="text-sm text-[#71717A] mt-1.5">The community that calls {project.name} home</p>
                </div>
                <div className="space-y-4">
                  {project.notableResidents.map(resident => (
                    <div key={resident.category} className="flex items-start gap-4 p-5 rounded-2xl border border-[#E4E4E7] bg-white hover:border-[#B8973B]/20 transition-colors">
                      <div className="w-10 h-10 rounded-2xl bg-[#F5EED4] flex items-center justify-center flex-shrink-0 text-[#B8973B]">
                        <Users size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#09090B] mb-1">{resident.category}</div>
                        <p className="text-sm text-[#71717A] leading-relaxed">{resident.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 rounded-xl bg-[#F4F4F5] flex items-start gap-2">
                  <Star size={13} className="text-[#B8973B] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#71717A] leading-relaxed">Resident profiles are based on publicly available information and market intelligence. Specific names are not disclosed in line with our privacy policy.</p>
                </div>
              </section>
            )}

            {/* Advisory */}
            {(project.whyRecommend || project.strengths.length > 0) && (
              <section id="advisory" className="py-12">
                <div className="mb-8">
                  <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-2">Private Advisory · Curated by Sreeja</div>
                  <h2 className="text-2xl font-light text-[#09090B] tracking-tight">Why We Recommend This Project</h2>
                </div>
                {project.whyRecommend && (
                  <p className="text-[#52525B] leading-relaxed mb-8 text-lg font-light italic border-l-2 border-[#B8973B] pl-5">&ldquo;{project.whyRecommend}&rdquo;</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div className="p-5 rounded-2xl bg-[#ECFDF5]">
                    <div className="text-xs font-semibold text-[#059669] uppercase tracking-widest mb-3">Strengths</div>
                    <ul className="space-y-2">
                      {project.strengths.map(s => (
                        <li key={s} className="flex gap-2 text-sm text-[#052e16]"><span className="text-[#059669] mt-0.5 flex-shrink-0">+</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                  {project.weaknesses.length > 0 && (
                    <div className="p-5 rounded-2xl bg-[#FFF7ED]">
                      <div className="text-xs font-semibold text-[#EA580C] uppercase tracking-widest mb-3">Considerations</div>
                      <ul className="space-y-2">
                        {project.weaknesses.map(w => (
                          <li key={w} className="flex gap-2 text-sm text-[#431407]"><span className="text-[#EA580C] mt-0.5 flex-shrink-0">~</span>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {project.bestSuitedFor.length > 0 && (
                  <div className="p-5 rounded-2xl border border-[#E4E4E7]">
                    <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-widest mb-3">Best Suited For</div>
                    <div className="flex flex-wrap gap-2">
                      {project.bestSuitedFor.map(type => (
                        <span key={type} className="px-3 py-1.5 rounded-full bg-[#F5EED4] text-[#B8973B] text-sm font-medium">{type}</span>
                      ))}
                    </div>
                  </div>
                )}
                {project.investmentThesis && (
                  <div className="mt-5 p-5 rounded-2xl bg-[#09090B]">
                    <div className="text-xs font-semibold text-[#B8973B] uppercase tracking-widest mb-2">Investment Thesis</div>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed">{project.investmentThesis}</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ── Sticky Sidebar ── */}
          <div>
            <div className="sticky top-32 space-y-4">
              {/* Pricing card */}
              <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white shadow-sm">
                <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-3">Starting from</div>
                <div className="text-3xl font-light text-[#09090B] tracking-tight">{project.configurations[0]?.price}</div>
                <div className="text-sm text-[#B8973B] mt-1">₹{(project.currentPricePerSqFt / 1000).toFixed(0)}K per sq ft</div>
                {(project.appreciationPercentage ?? 0) > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-[#F5EED4]">
                    <div className="text-xs text-[#A07C2A] mb-0.5">Historical Appreciation</div>
                    <div className="text-lg font-medium text-[#B8973B]">+{project.appreciationPercentage}%</div>
                    <div className="text-xs text-[#A07C2A]">Since {project.launchYear}</div>
                  </div>
                )}
                <div className="mt-5 space-y-2">
                  <Link href={`/presentation/${project.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#09090B] text-white text-sm hover:bg-[#27272A] transition-colors">
                    <Maximize2 size={13} /> Present to Client
                  </Link>
                  <Link href={`/compare?add=${project.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E4E4E7] text-sm text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
                    Compare Project
                  </Link>
                  <Link href="/client/shortlist" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#B8973B]/30 text-sm text-[#B8973B] bg-[#F5EED4] hover:bg-[#F5E8C0] transition-colors">
                    Add to Shortlist
                  </Link>
                </div>
              </div>

              {/* Quick links */}
              <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-3">Quick Links</div>
                <div className="space-y-1">
                  {[
                    { label: 'Master Layout', id: 'master-layout', icon: Map },
                    { label: 'Floor Plans', id: 'floor-plans', icon: LayoutGrid },
                    { label: 'Amenities', id: 'amenities', icon: Star },
                    { label: 'Who Lives Here', id: 'residents', icon: Users },
                    { label: 'Advisory Note', id: 'advisory', icon: FileText },
                  ].map(({ label, id, icon: Icon }) => (
                    <a key={id} href={`#${id}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#09090B] transition-colors">
                      <Icon size={13} className="text-[#B8973B]" /> {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Brochure */}
              <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-3">Brochure</div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E4E4E7] text-sm text-[#52525B] hover:bg-[#F4F4F5] transition-colors mb-2">
                  <FileText size={13} /> View Brochure
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F5EED4] text-sm text-[#B8973B] hover:bg-[#F5E8C0] transition-colors">
                  <Download size={13} /> Download PDF
                </button>
              </div>

              {/* Rental yield */}
              {project.rentalYield && !project.rentalYield.includes('N/A') && (
                <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2">Rental Yield</div>
                  <div className="text-2xl font-light text-[#09090B]">{project.rentalYield}</div>
                  <div className="text-xs text-[#71717A] mt-1">Indicative gross yield</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
