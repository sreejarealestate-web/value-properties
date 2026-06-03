'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locations } from '@/data/locations'
import { getProjectsByLocation } from '@/data/projects'
import { ArrowLeft, MapPin, School, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location: slug } = use(params)
  const location = locations.find(l => l.slug === slug)
  if (!location) notFound()
  const locationProjects = getProjectsByLocation(location.id)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={location.heroImage} alt={location.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
          <Link href="/properties" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 w-fit transition-colors">
            <ArrowLeft size={16} /> All Locations
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-[#D4AF5A] text-xs font-semibold tracking-widest uppercase mb-2">South Mumbai</div>
            <h1 className="text-5xl font-light text-white tracking-tight">{location.name}</h1>
            <p className="text-white/70 mt-3 max-w-xl text-lg font-light">{location.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-light text-[#09090B] tracking-tight mb-4">Overview</h2>
              <p className="text-[#52525B] leading-relaxed">{location.overview}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-light text-[#09090B] tracking-tight mb-4">Lifestyle</h2>
              <p className="text-[#52525B] leading-relaxed">{location.lifestyle}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-light text-[#09090B] tracking-tight mb-4">Connectivity</h2>
              <p className="text-[#52525B] leading-relaxed">{location.connectivity}</p>
            </section>

            {/* Projects */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-[#09090B] tracking-tight">Projects in {location.name}</h2>
                <span className="text-sm text-[#A1A1AA]">{locationProjects.length} projects</span>
              </div>
              {locationProjects.length === 0 ? (
                <div className="p-12 rounded-3xl border border-[#E4E4E7] text-center text-[#A1A1AA]">
                  Projects coming soon for this location.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {locationProjects.map((project, i) => (
                    <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Link href={`/properties/${slug}/${project.id}`} className="group block rounded-2xl overflow-hidden border border-[#E4E4E7] bg-white hover:shadow-lg transition-all duration-400">
                        <div className="relative h-44 overflow-hidden">
                          <img src={project.elevationImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                          <div className={cn('absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full',
                            project.possessionStatus === 'Ready To Move' ? 'bg-[#ECFDF5] text-[#059669]' :
                            project.possessionStatus === 'Under Construction' ? 'bg-[#FFF7ED] text-[#EA580C]' : 'bg-[#EFF6FF] text-[#2563EB]'
                          )}>
                            {project.possessionStatus}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-[#09090B]">{project.name}</h3>
                          <p className="text-xs text-[#71717A] mt-1">{project.developer} · {project.location}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F4F4F5]">
                            <div className="text-xs text-[#B8973B] font-semibold">₹{(project.currentPricePerSqFt/1000).toFixed(0)}K/sq ft</div>
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5EED4] text-[#B8973B]">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scores */}
            <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white">
              <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-5">Intelligence Scores</div>
              {[
                { label: 'Connectivity', score: location.connectivityScore },
                { label: 'Infrastructure', score: location.infrastructureScore },
                { label: 'Lifestyle', score: location.lifestyleScore },
                { label: 'Future Growth', score: location.futureGrowthScore },
              ].map(s => (
                <div key={s.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#52525B]">{s.label}</span>
                    <span className="font-semibold text-[#09090B]">{s.score}</span>
                  </div>
                  <div className="h-1.5 bg-[#F4F4F5] rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#B8973B] to-[#D4AF5A]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white">
              <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-3">Average Pricing</div>
              <div className="text-lg font-light text-[#09090B]">{location.averagePricing}</div>
              <div className="mt-2 text-xs text-[#71717A]">{location.futurePotential}</div>
            </div>

            {/* Infrastructure */}
            <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white">
              <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-4">Nearby</div>
              {[
                { label: 'Schools', items: location.schools, icon: School },
                { label: 'Hospitals', items: location.hospitals, icon: Building2 },
                { label: 'Clubs', items: location.clubs, icon: MapPin },
              ].map(({ label, items, icon: Icon }) => (
                <div key={label} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon size={11} className="text-[#B8973B]" />
                    <span className="text-xs font-semibold text-[#52525B]">{label}</span>
                  </div>
                  {items.slice(0, 3).map(item => (
                    <div key={item} className="text-xs text-[#71717A] py-0.5 pl-4">{item}</div>
                  ))}
                </div>
              ))}
            </div>

            {/* Resident Profile */}
            <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white">
              <div className="text-xs font-semibold text-[#A1A1AA] tracking-widest uppercase mb-3">Resident Profile</div>
              <p className="text-sm text-[#52525B] leading-relaxed">{location.residentProfile}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
