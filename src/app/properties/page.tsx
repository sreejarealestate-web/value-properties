'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { locations } from '@/data/locations'
import { getProjectsByLocation } from '@/data/projects'
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function PropertiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">All Locations</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">South Mumbai Properties</h1>
          <p className="text-[#71717A] mt-3 max-w-xl">Explore curated luxury projects across South Mumbai's most prestigious micro-markets.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, i) => {
            const locationProjects = getProjectsByLocation(location.id)
            return (
              <motion.div key={location.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/properties/${location.slug}`} className="group block rounded-3xl overflow-hidden border border-[#E4E4E7] bg-white hover:shadow-xl transition-all duration-500">
                  <div className="relative h-48 overflow-hidden">
                    <img src={location.heroImage} alt={location.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-xl font-medium text-white">{location.name}</h2>
                    </div>
                    {locationProjects.length > 0 && (
                      <div className="absolute top-4 right-4 bg-[#B8973B] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {locationProjects.length} Projects
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-[#71717A] leading-relaxed mb-4 line-clamp-2">{location.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-0.5">Starting from</div>
                        <div className="text-sm font-medium text-[#09090B]">{location.averagePricing.split('-')[0].trim()}</div>
                      </div>
                      <div className="flex items-center gap-1 text-[#B8973B]">
                        <TrendingUp size={14} />
                        <span className="text-xs font-semibold">{location.futureGrowthScore}/100</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#F4F4F5] flex items-center justify-between">
                      <div className="grid grid-cols-3 gap-3 flex-1">
                        {[
                          { label: 'Connect', val: location.connectivityScore },
                          { label: 'Lifestyle', val: location.lifestyleScore },
                          { label: 'Growth', val: location.futureGrowthScore },
                        ].map(s => (
                          <div key={s.label}>
                            <div className="text-[10px] text-[#A1A1AA] mb-1">{s.label}</div>
                            <div className="h-1 bg-[#F4F4F5] rounded-full">
                              <div className="h-full rounded-full bg-[#B8973B]" style={{ width: `${s.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <ArrowRight size={16} className="text-[#D4D4D8] group-hover:text-[#B8973B] ml-4 transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
