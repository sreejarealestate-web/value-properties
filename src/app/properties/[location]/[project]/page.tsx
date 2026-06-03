'use client'

import { use, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locations } from '@/data/locations'
import { getProjectById } from '@/data/projects'
import { ArrowLeft, Building2, Layers, Users, Ruler, ChevronDown, ChevronUp, Share2, BookOpen, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 border-b border-[#F4F4F5]">
      <h2 className="text-xl font-light text-[#09090B] tracking-tight mb-6">{title}</h2>
      {children}
    </section>
  )
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F4F4F5] last:border-0">
      <span className="text-sm text-[#71717A]">{label}</span>
      <span className="text-sm font-medium text-[#09090B] text-right max-w-xs">{value}</span>
    </div>
  )
}

export default function ProjectPage({ params }: { params: Promise<{ location: string; project: string }> }) {
  const { location: locationSlug, project: projectId } = use(params)
  const project = getProjectById(projectId)
  const location = locations.find(l => l.slug === locationSlug)
  if (!project || !location) notFound()

  const [activeImage, setActiveImage] = useState(0)
  const [showBrochure, setShowBrochure] = useState(false)

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
          <Link href="/properties" className="hover:text-[#09090B] transition-colors">Properties</Link>
          <span>/</span>
          <Link href={`/properties/${locationSlug}`} className="hover:text-[#09090B] transition-colors">{location.name}</Link>
          <span>/</span>
          <span className="text-[#09090B]">{project.name}</span>
        </div>
      </div>

      {/* Hero gallery */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-4 gap-2 h-[500px] rounded-3xl overflow-hidden">
          <div className="col-span-3 relative overflow-hidden">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              src={project.images[activeImage] || project.heroImage}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            {project.images.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={cn('flex-1 overflow-hidden rounded-xl', activeImage === i ? 'ring-2 ring-[#B8973B]' : 'opacity-70 hover:opacity-100')}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F5EED4] text-[#B8973B] font-semibold">{tag}</span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-light text-[#09090B] tracking-tight">{project.name}</h1>
                  <p className="text-[#71717A] mt-2">{project.developer} · {project.location}</p>
                </div>
                <div className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold',
                  project.possessionStatus === 'Ready To Move' ? 'bg-[#ECFDF5] text-[#059669]' :
                  project.possessionStatus === 'Under Construction' ? 'bg-[#FFF7ED] text-[#EA580C]' : 'bg-[#EFF6FF] text-[#2563EB]'
                )}>
                  {project.possessionStatus}
                </div>
              </div>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F4F4F5] mb-10">
              {[
                { label: 'Towers', value: project.towers },
                { label: 'Storeys', value: project.totalStoreys },
                { label: 'Land Parcel', value: project.landParcel },
                { label: 'Ceiling Height', value: project.ceilingHeight },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-light text-[#09090B]">{s.value}</div>
                  <div className="text-xs text-[#A1A1AA] mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Project details */}
            <Section title="Project Overview">
              <div className="space-y-0">
                <DataRow label="Developer" value={project.developer} />
                <DataRow label="Location" value={project.location} />
                <DataRow label="Land Parcel" value={project.landParcel} />
                <DataRow label="Tenure" value={project.tenure} />
                <DataRow label="Towers" value={project.towers} />
                <DataRow label="Total Storeys" value={project.totalStoreys} />
                <DataRow label="Apartments Per Floor" value={project.apartmentsPerFloor} />
                <DataRow label="First Habitable Floor" value={project.firstHabitableFloor} />
                <DataRow label="Ceiling Height" value={project.ceilingHeight} />
                <DataRow label="Car Park Type" value={project.carParkType} />
                <DataRow label="Maintenance" value={project.maintenance} />
                <DataRow label="Possession" value={project.possessionStatus + (project.possessionDate ? ` — ${project.possessionDate}` : '')} />
              </div>
              <div className="mt-6 p-5 rounded-xl bg-[#F4F4F5]">
                <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Elevation Explained</div>
                <p className="text-sm text-[#52525B] leading-relaxed">{project.elevationExplained}</p>
              </div>
            </Section>

            {/* Configuration table */}
            <Section title="Configurations & Pricing">
              <div className="overflow-hidden rounded-2xl border border-[#E4E4E7]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F4F4F5]">
                      {['Type', 'Carpet Area', 'Price', 'Per Sq Ft'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] tracking-wide uppercase">{h}</th>
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
            </Section>

            {/* Available inventory */}
            <Section title="Available Inventory">
              <div className="space-y-3">
                {project.availableInventory.filter(u => u.status === 'Available').map(unit => (
                  <div key={unit.id} className="flex items-center justify-between p-4 rounded-xl border border-[#E4E4E7] hover:border-[#B8973B]/30 transition-colors">
                    <div className="flex items-center gap-4">
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
                  <p className="text-sm text-[#A1A1AA] p-4">Contact us for current availability.</p>
                )}
              </div>
            </Section>

            {/* Amenities */}
            <Section title="Amenities">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {project.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 p-3 rounded-xl bg-[#F4F4F5]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B8973B]" />
                    <span className="text-xs text-[#52525B]">{amenity}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Why we recommend */}
            {(project.whyRecommend || project.strengths.length > 0) && (
              <Section title="Why We Recommend This Project">
                {project.whyRecommend && (
                  <p className="text-[#52525B] leading-relaxed mb-6 italic">&ldquo;{project.whyRecommend}&rdquo;</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#ECFDF5]">
                    <div className="text-xs font-semibold text-[#059669] tracking-widest uppercase mb-3">Strengths</div>
                    <ul className="space-y-2">
                      {project.strengths.map(s => (
                        <li key={s} className="flex gap-2 text-sm text-[#052e16]">
                          <span className="text-[#059669] mt-0.5">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {project.weaknesses.length > 0 && (
                    <div className="p-5 rounded-2xl bg-[#FFF7ED]">
                      <div className="text-xs font-semibold text-[#EA580C] tracking-widest uppercase mb-3">Considerations</div>
                      <ul className="space-y-2">
                        {project.weaknesses.map(w => (
                          <li key={w} className="flex gap-2 text-sm text-[#431407]">
                            <span className="text-[#EA580C] mt-0.5">~</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {project.bestSuitedFor.length > 0 && (
                  <div className="mt-5 p-5 rounded-2xl border border-[#E4E4E7]">
                    <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-3">Best Suited For</div>
                    <div className="flex flex-wrap gap-2">
                      {project.bestSuitedFor.map(type => (
                        <span key={type} className="px-3 py-1 rounded-full bg-[#F5EED4] text-[#B8973B] text-xs font-semibold">{type}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Sticky sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white shadow-sm">
                <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-4">Starting from</div>
                <div className="text-3xl font-light text-[#09090B] tracking-tight">{project.configurations[0]?.price}</div>
                <div className="text-sm text-[#B8973B] mt-1">₹{(project.currentPricePerSqFt/1000).toFixed(0)}K per sq ft</div>

                {(project.appreciationPercentage ?? 0) > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-[#F5EED4]">
                    <div className="text-xs text-[#A07C2A] mb-1">Historical Appreciation</div>
                    <div className="text-lg font-medium text-[#B8973B]">+{project.appreciationPercentage}%</div>
                    <div className="text-xs text-[#A07C2A]">Since {project.launchYear}</div>
                  </div>
                )}

                <div className="mt-5 space-y-2">
                  <Link href={`/compare?add=${project.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E4E4E7] text-sm text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
                    Compare Project
                  </Link>
                  <Link href="/client/shortlist" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#B8973B] text-white text-sm hover:bg-[#A07C2A] transition-colors">
                    Add to Shortlist
                  </Link>
                </div>
              </div>

              {project.investmentThesis && (
                <div className="p-5 rounded-2xl bg-[#09090B]">
                  <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-3">Investment Thesis</div>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">{project.investmentThesis}</p>
                </div>
              )}

              {project.rentalYield && (
                <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-2">Rental Yield</div>
                  <div className="text-2xl font-light text-[#09090B]">{project.rentalYield}</div>
                </div>
              )}

              <Link href={`/presentation/${project.id}`} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E4E4E7] text-sm text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
                <Maximize2 size={14} /> Present to Client
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
